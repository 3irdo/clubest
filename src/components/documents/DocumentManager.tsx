import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const DocumentManager: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const mockDocuments = [
    {
      id: '1',
      title: 'Certificado Médico',
      file_name: 'certificado_medico.pdf',
      file_type: 'application/pdf',
      size_bytes: 245678,
      uploaded_at: '2025-09-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Comprobante de Pago',
      file_name: 'pago_octubre.pdf',
      file_type: 'application/pdf',
      size_bytes: 128945,
      uploaded_at: '2025-10-01T14:30:00Z'
    }
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-dark">Mis Documentos</h2>
        <Button variant="accent" onClick={() => setIsUploadModalOpen(true)}>
          <Upload size={20} className="mr-2" />
          Subir Documento
        </Button>
      </div>

      <div className="grid gap-4">
        {mockDocuments.map((doc) => (
          <Card key={doc.id}>
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
                    {doc.file_name} • {formatFileSize(doc.size_bytes)} • {formatDate(doc.uploaded_at)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download size={20} className="text-primary" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={20} className="text-red-500" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Subir Documento"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Título del documento
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Ej: Certificado Médico"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Archivo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-text-secondary">
                Click para seleccionar o arrastra el archivo aquí
              </p>
              <p className="text-sm text-text-secondary mt-1">
                PDF, DOC, DOCX (máx. 10MB)
              </p>
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary">
              Subir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
