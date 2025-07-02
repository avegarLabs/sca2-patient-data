import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { DatosGenerales } from '../interfaces/datos_generales';

@Injectable({
  providedIn: 'root',
})
export class GeneralDataService {
  persons = signal<DatosGenerales[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  async loadDataOfPersons() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await invoke<DatosGenerales[]>('list_datos_generales');
      this.persons.set(result);
    } catch (e) {
      console.error(e);
      this.error.set('Error cargando registros');
    } finally {
      this.loading.set(false);
    }
  }

  async initGeneralData(basicData: any) {
    try {
      await invoke('add_datos_generales', {
          codigo: basicData.codigo,
          nombresApellidos: basicData.fullName,
          historiaClinica: basicData.hc,
          areaSalud: basicData.as
        });
      this.loadDataOfPersons();
    } catch (e) {
      console.error(e);
      this.error.set('Error insertando registro');
    }
  }
}
