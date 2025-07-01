import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  protected docen$!: Observable<Docente[]>;


  ngOnInit() {
    this.cargarDocentes();
  }


  cargarDocentes() {
    this.docen$ = this.serv.listar();
  }


}
