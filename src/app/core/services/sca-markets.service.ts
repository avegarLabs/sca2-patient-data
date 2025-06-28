import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { Observable, from } from 'rxjs';
import { Sca } from '../interfaces/sca';

@Injectable({
  providedIn: 'root',
})
export class ScaMarketsService {
  scas = signal<Sca[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  async loadScas() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await invoke<Sca[]>('list_scas');
      this.scas.set(result);
    } catch (e) {
      console.error(e);
      this.error.set('Error cargando registros');
    } finally {
      this.loading.set(false);
    }
  }

  async addSca(nombre: string) {
    try {
      await invoke('insert_sca', { newNombre: nombre });
      this.loadScas();
    } catch (e) {
      console.error(e);
      this.error.set('Error insertando registro');
    }
  }

  async deleteSca(id: number) {
    try {
    await invoke('delete_sca', { scaId: id });
      this.loadScas();
    } catch (e) {
      console.error(e);
      this.error.set('Error eliminando registro');
    }
  }
}
