import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  // Lista de toasts ativos 
  toasts = signal<Toast[]>([]);

  
  private idCounter = 0;

  show(message: string, type: 'success' | 'error' | 'info') {
    const id = this.idCounter++;
    
    
    this.toasts.update(current => [...current, { id, message, type }]);

    
    setTimeout(() => {
      this.remove(id);
    }, 3000); //  3 segundos
  }

  
  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  
  remove(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}