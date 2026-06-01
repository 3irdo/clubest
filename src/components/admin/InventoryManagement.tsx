import React, { useState, useRef } from 'react';
import { CreditCard as Edit, Trash2, Package, Upload } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { LoadingSpinner, ErrorMessage } from '../ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../hooks/useData';
import { getProducts, createProduct, updateProduct, uploadProductImage, deleteProduct, deleteProductImage } from '../../lib/api/products';
import { notifyRole } from '../../lib/api/notifications';

export const InventoryManagement: React.FC = () => {
  const { profile } = useAuth();
  const clientId = profile?.client_id;

  const { data: products, isLoading, error, reload } = useData(
    () => clientId ? getProducts(clientId) : Promise.resolve([]),
    [clientId]
  );

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', stock: '' });
    setImageFile(null);
    setUploadError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const openCreate = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setForm({
      name: product.name ?? '',
      description: product.description ?? '',
      price: product.price?.toString() ?? '',
      stock: product.stock?.toString() ?? '',
    });
    setImageFile(null);
    setUploadError(null);
    if (fileRef.current) fileRef.current.value = '';
    setShowModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;

    setSaving(true);
    setUploadError(null);
    try {
      const product = await createProduct({
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        description: form.description || undefined,
      }, clientId);

      if (imageFile && product) {
        try {
          const imageUrl = await uploadProductImage(imageFile, product.id_product, clientId);
          await updateProduct(product.id_product, { image_url: imageUrl }, clientId);
        } catch {
          setUploadError('Producto creado, pero la imagen no pudo subirse.');
        }
      }

      const createdStock = parseInt(form.stock);
      if (createdStock <= 5) {
        notifyRole(clientId, 'ADMIN', {
          title: 'Low stock product added',
          message: `"${form.name}" was created with only ${createdStock} units in stock.`,
          type: 'warning',
          link: '/admin',
        }).catch(console.error);
      }

      resetForm();
      setShowModal(false);
      await reload();
    } catch (err: any) {
      alert('Error al crear producto: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !editingProduct) return;

    setSaving(true);
    setUploadError(null);
    try {
      const updates: any = {
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        description: form.description || undefined,
      };

      if (imageFile) {
        const imageUrl = await uploadProductImage(imageFile, editingProduct.id_product, clientId);
        updates.image_url = imageUrl;
        if (editingProduct.image_url) {
          deleteProductImage(editingProduct.image_url).catch(() => {});
        }
      }

      await updateProduct(editingProduct.id_product, updates, clientId);

      const updatedStock = parseInt(form.stock);
      if (updatedStock <= 5) {
        notifyRole(clientId, 'ADMIN', {
          title: 'Low stock alert',
          message: `"${form.name}" is running low (${updatedStock} units remaining).`,
          type: 'warning',
          link: '/admin',
        }).catch(console.error);
      }

      resetForm();
      setEditingProduct(null);
      setShowModal(false);
      await reload();
    } catch (err: any) {
      alert('Error al actualizar producto: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: any) => {
    if (!clientId) return;
    if (!window.confirm('¿Eliminar este producto?')) return;

    setDeleting(product.id_product);
    try {
      if (product.image_url) {
        await deleteProductImage(product.image_url).catch(() => {});
      }
      await deleteProduct(product.id_product, clientId);
      await reload();
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (!clientId) return <LoadingSpinner message="Cargando perfil..." />;
  if (isLoading) return <LoadingSpinner message="Cargando inventario..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-dark">Gestión de Inventario</h2>
        <Button variant="accent" onClick={openCreate}>
          <Package size={20} className="mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Producto</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Precio</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Stock</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Estado</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(products ?? []).length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-text-secondary">No hay productos registrados.</td></tr>
              ) : (
                (products ?? []).map((product: any) => (
                  <tr key={product.id_product} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">N/A</div>
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-text-secondary line-clamp-1">
                          {product.description ?? ''}
                        </p>
                      </div>
                    </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-primary">
                      ${product.price?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-text-primary'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.stock === 0
                          ? 'bg-red-500 text-white'
                          : product.stock < 10
                          ? 'bg-yellow-400 text-primary-dark'
                          : 'bg-accent-green text-primary-dark'
                      }`}>
                        {product.stock === 0 ? 'Agotado' : product.stock < 10 ? 'Bajo stock' : 'Disponible'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={18} className="text-primary" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deleting === product.id_product}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingProduct(null); }}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <form onSubmit={editingProduct ? handleUpdate : handleCreate} className="space-y-4">
          <Input
            label="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <Input
              label="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
            <div className="flex items-center gap-3">
              {editingProduct?.image_url && (
                <img src={editingProduct.image_url} alt="" className="w-10 h-10 rounded object-cover" />
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-green file:text-primary-dark hover:file:bg-secondary cursor-pointer"
              />
            </div>
          </div>
          {uploadError && (
            <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">{uploadError}</p>
          )}
          <div className="flex gap-4 pt-2">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Guardando...' : editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditingProduct(null); }}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
