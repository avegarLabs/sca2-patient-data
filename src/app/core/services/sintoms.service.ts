import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { Observable, from } from 'rxjs';
import { Sintoms } from '../interfaces/sintoms';

@Injectable({
  providedIn: 'root'
})
export class SintomsService {
   simtoms = signal<Sintoms[]>([]);
   loading = signal(false);
  error = signal<string | null>(null);

async loadSintoms() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await invoke<Sintoms[]>('list_sintomas');
      this.simtoms.set(result);
    } catch (e) {
      console.error(e);
      this.error.set('Error cargando registros');
    } finally {
      this.loading.set(false);
    }
  }

  async addSintom(nombre: string) {
    try {
      await invoke('insert_sintoma', { newNombre: nombre });
      this.loadSintoms();
    } catch (e) {
      console.error(e);
      this.error.set('Error insertando registro');
    }
  }

  async deleteSintom(id: number) {
    try {
    await invoke('delete_sintoma', { sintomaId: id });
      this.loadSintoms();
    } catch (e) {
      console.error(e);
      this.error.set('Error eliminando registro');
    }
  }

}
