import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, CreditCard as Edit } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { LoadingSpinner, ErrorMessage } from '../ui/LoadingSpinner';
import { useAuth, ROLE_NAMES } from '../../context/AuthContext';
import { useData } from '../../hooks/useData';
import { getDocuments, uploadDocumentFile, createDocument, updateDocument, deleteDocument, reorderDocuments } from '../../lib/api/documents';

export const DocumentManager: React.FC = () => {
  const { profile, hasRole } = useAuth();
  const clientId = profile?.client_id;
  const userId = profile?.id;
  const isMember = hasRole(ROLE_NAMES.MEMBER);

  const { data: documents, isLoading, error, reload } = useData(
    () => clientId ? getDocuments(clientId, isMember ? userId : undefined) : Promise.resolve([]),
    [clientId, userId, isMember]
  );

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [editingDoc, setEditingDoc] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !userId || !file || !title.trim()) return;
    setSaving(true);
    try {
      const fileInfo = await uploadDocumentFile(file, clientId);
      const maxOrder = (documents ?? []).reduce((max, d: any) => Math.max(max, d.sort_order ?? 0), 0);
      await createDocument({
        title: title.trim(),
        ...fileInfo,
        sort_order: maxOrder + 1,
      }, clientId, userId);
      setTitle('');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      setIsUploadModalOpen(false);
      await reload();
    } catch (err: any) {
      alert('Error al subir documento: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (doc: any) => {
    setEditingDoc(doc);
    setEditTitle(doc.title ?? '');
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !editingDoc || !editTitle.trim()) return;
    setSaving(true);
    try {
      await updateDocument(editingDoc.id_document, { title: editTitle.trim() }, clientId, isMember ? userId : undefined);
      setEditingDoc(null);
      setEditTitle('');
      await reload();
    } catch (err: any) {
      alert('Error al actualizar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!clientId) return;
    if (!window.confirm('¿Eliminar este documento?')) return;
    setDeleting(id);
    try {
      await deleteDocument(id, clientId, isMember ? userId : undefined);
      await reload();
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleDragStart = (id: string) => {
    setDragId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (!clientId || !dragId || dragId === targetId) return;
    const items = [...(documents ?? [])] as any[];
    const fromIdx = items.findIndex((d) => d.id_document === dragId);
    const toIdx = items.findIndex((d) => d.id_document === targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const [moved] = items.splice(fromIdx, 1);
    items.splice(toIdx, 0, moved);
    const orderedIds = items.map((d) => d.id_document);
    try {
      await reorderDocuments(orderedIds, clientId, isMember ? userId : undefined);
      await reload();
    } catch {
      // reorder failure is non-critical
    }
    setDragId(null);
  };

  if (!clientId) return <LoadingSpinner message="Cargando perfil..." />;
  if (isLoading) return <LoadingSpinner message="Cargando documentos..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl font-bold text-primary-dark">Mis Documentos</h2>
        <Button variant="accent" onClick={() => setIsUploadModalOpen(true)} className="w-full sm:w-auto">
          <Upload size={20} className="mr-2" />
          Subir Documento
        </Button>
      </div>

      <div className="grid gap-4">
        {(documents ?? []).length === 0 ? (
          <p className="text-text-secondary text-sm py-4">No hay documentos subidos.</p>
        ) : (
          (documents ?? []).map((doc: any) => (
            <div
              key={doc.id_document}
              draggable
              onDragStart={() => handleDragStart(doc.id_document)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(doc.id_document)}
              onDragEnd={() => setDragId(null)}
              className={`cursor-grab active:cursor-grabbing ${dragId === doc.id_document ? 'opacity-50' : ''}`}
            >
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
                      <FileText size={32} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-dark">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {doc.file_name} &bull; {formatFileSize(doc.size_bytes)} &bull; {formatDate(doc.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(doc)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={20} className="text-primary" />
                    </button>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors inline-flex"
                    >
                      <Download size={20} className="text-primary" />
                    </a>
                    <button
                      onClick={() => handleDelete(doc.id_document)}
                      disabled={deleting === doc.id_document}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={!!editingDoc}
        onClose={() => { setEditingDoc(null); setEditTitle(''); }}
        title="Editar título"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="Título del documento"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => { setEditingDoc(null); setEditTitle(''); }}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Subir Documento"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Título del documento
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Ej: Certificado Médico"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Archivo
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-text-secondary">
                {file ? file.name : 'Click para seleccionar o arrastra el archivo aquí'}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                PDF, DOC, DOCX (máx. 10MB)
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
              required
            />
          </div>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={saving || !file || !title.trim()}>
              {saving ? 'Subiendo...' : 'Subir'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
