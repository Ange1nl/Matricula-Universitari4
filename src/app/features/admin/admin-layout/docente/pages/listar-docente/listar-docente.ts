import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Docente } from '../../models/docente';
import { DocenteService } from '../../services/docente.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-docente',
  imports: [RouterLink,AsyncPipe,CommonModule,],
  templateUrl: './listar-docente.html',
  styleUrl: './listar-docente.css'
})
export class ListarDocente {

  private serv = inject(DocenteService);
  private router = inject(Router);
  protected docen$!: Observable<Docente[]>;


  ngOnInit() {
    this.cargarDocentes();
  }

  cargarDocentes() {
    this.docen$ = this.serv.listar();
  }

  editarDocente(id: number) {
    this.router.navigate(['/admin/docente/registrar', id]);
  }


  eliminarDocente(id: number) {
    const confirmar = confirm('¿Deseas eliminar este docente?');
    if (confirmar) {
      this.serv.eliminar(id).subscribe({
        next: () => {
          alert('Docente eliminado correctamente');
          this.cargarDocentes();
        },
        error: () => alert('Error al eliminar el docente')
      });
    }
  }


}
