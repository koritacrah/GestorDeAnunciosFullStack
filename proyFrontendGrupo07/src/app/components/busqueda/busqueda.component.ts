import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Anuncio } from 'src/app/models/anuncio';
import { Area } from 'src/app/models/area';
import { ElementForList } from 'src/app/models/element-for-list';
import { Empleado } from 'src/app/models/empleado';
import { Medio } from 'src/app/models/medio';
import { Rol } from 'src/app/models/rol';
import { AnunciosService } from 'src/app/services/anuncios.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { MedioService } from 'src/app/services/medio.service';
import { RolService } from 'src/app/services/rol.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {
  display : boolean = false;
  filtrosDisponibles: Array<string> = [];
  anuncios = new Array<Anuncio>();
  destinatarioSelected: boolean = false;
  fechasSelected: boolean = false;
  medioSelected: boolean = false;
  tituloSelected: boolean = false;
  tipoSelected: boolean = false;
  estadoSelected: boolean = false;
  redactorSelected: boolean = false;
  mediosDisponibles = new Array<Medio>();
  empleados = new Array<Empleado>();
  areas = new Array<Area>();
  roles = new Array<Rol>();

  //DROPDOWN FILTRO
  dataFiltros: Array<ElementForList> = new Array<ElementForList>();//{ item_id: number, item_text: string }
  settingsFiltros: IDropdownSettings = {
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: "Seleccionar Todos",
    unSelectAllText: "Deseleccionar Todos"
  };

  filtroForm = new FormGroup({
    filtros: new FormControl([], Validators.required),
    destinatario: new FormControl([]),//[], Validators.required
    fechaStart: new FormControl(),
    fechaEnd: new FormControl(),
    medio: new FormControl(),//[], Validators.required
    titulo: new FormControl(),
    tipo: new FormControl(),
    estado: new FormControl(),
    redactor: new FormControl(),
  })
  anunciosAFiltrar= new Array<Anuncio>();
  displayMedios: boolean = false;


  constructor(private es: EmpleadoService,private as: AnunciosService, private rout: Router, private ms: MedioService , private rs: RolService) { 
this.obtenerAnuncios();
this.cargarFiltros();
this.cargarMedios()
this.listarRoles()
this.obtenerEmpleados();
  }
  
obtenerEmpleados(){
  this.es.getEmpleado().subscribe(
    (result) => {
      console.log(result);
      result.forEach((element: any) => {
        this.empleados.push(element);
      });
    });
  console.log(this.empleados);
}

  async obtenerAnuncios() {
    this.anuncios = new Array<Anuncio>();
    this.as.getAnuncios().subscribe(result => {
      console.log(result);
      result.forEach((element: any) => {
        var unAnuncio = new Anuncio();
        Object.assign(unAnuncio, element);
        this.anuncios.push(unAnuncio);
      });
    });
    await new Promise(f => setTimeout(f, 90));
  }

  async cargarFiltros() {
    //destinatario, fechas, medio de publicación, texto, tipo de contenido,estado, redactor
    this.filtrosDisponibles = new Array<string>();
    this.filtrosDisponibles.push("Destinatario");
    this.filtrosDisponibles.push("Fechas");
    this.filtrosDisponibles.push("Medio");
    this.filtrosDisponibles.push("Titulo");
    this.filtrosDisponibles.push("Tipo");
    this.filtrosDisponibles.push("Estado");
    this.filtrosDisponibles.push("Redactor");
    await new Promise(f => setTimeout(f, 90));

    console.log("medios")
    console.log(this.filtrosDisponibles);

    this.filtroForm.get('filtros')?.setValue([]);
    this.dataFiltros = new Array<ElementForList>();

    this.filtrosDisponibles.forEach(element => {
      var elemento = new ElementForList();
      elemento.item_id = element;
      elemento.item_text = element;
      this.dataFiltros.push(elemento);
    });
    await new Promise(f => setTimeout(f, 90));
    console.log(this.dataFiltros);

    this.display=true;
  }

  cambioFiltro() {
    var filtrosElegidos = this.filtroForm.get('filtros')?.value;
    filtrosElegidos.forEach(async (element: any) => {

      switch (element.item_id) {
        case "Fechas": {
          this.filtroForm.get('fechaStart')?.setValidators(Validators.required);
          this.filtroForm.get('fechaStart')?.setValue(null);

          this.filtroForm.get('fechaEnd')?.setValidators(Validators.required);
          this.filtroForm.get('fechaEnd')?.setValue(null);
          this.fechasSelected=true;
          break;
        }
        case "Medio": {
          this.filtroForm.get('medio')?.setValidators(Validators.required);
          this.filtroForm.get('medio')?.setValue(null);
          this.medioSelected = true;
          console.log("si");
          break;
        }
        case "Titulo": {
          this.filtroForm.get('titulo')?.setValidators(Validators.required);
          this.filtroForm.get('titulo')?.setValue(null);
          this.tituloSelected = true;
          break;
        }
        case "Tipo": {
          this.filtroForm.get('tipo')?.setValidators(Validators.required);
          this.filtroForm.get('tipo')?.setValue(null);
          this.tipoSelected = true;
          break;
        }
        case "Estado": {
          this.filtroForm.get('estado')?.setValidators(Validators.required);
          this.filtroForm.get('estado')?.setValue(null);
          this.estadoSelected = true;
          break;
        }
        case "Redactor": {
          this.filtroForm.get('redactor')?.setValidators(Validators.required);
          this.filtroForm.get('redactor')?.setValue(null);
          this.redactorSelected = true;
          break;
        }
        case "Destinatario": {
          this.filtroForm.get('destinatario')?.setValidators(Validators.required);
          this.filtroForm.get('destinatario')?.setValue(null);
          this.destinatarioSelected = true;
          break;
        }
      }
      await new Promise(f => setTimeout(f, 60));
    });
  }

  listarRoles() {
    this.roles = new Array<Rol>();
    this.rs.getRoles().subscribe(
      (resultado) => {
        resultado.forEach((element: any) => {
          var unRol = new Rol();
          Object.assign(unRol, element);
          this.roles.push(unRol);
        });
      });
  }

  async cargarMedios() {
    this.displayMedios=false;
    this.mediosDisponibles = new Array<Medio>();
    var unMedio = new Medio();
    unMedio.nombre = "Facebook";
    unMedio._id ="Facebook";
    this.mediosDisponibles.push(unMedio);
    unMedio = new Medio();
    unMedio.nombre = "TV";
    unMedio._id ="TV";
    this.mediosDisponibles.push(unMedio);
    this.ms.getMedios().subscribe(
      (result) => {
        result.forEach((element: any) => {
          var unMedio = new Medio();
          Object.assign(unMedio, element);
          this.mediosDisponibles.push(unMedio);
        });
      });
    await new Promise(f => setTimeout(f, 90));
    console.log("medios")
    console.log(this.mediosDisponibles);
    this.filtroForm.get('medio')?.setValue("");
    
    await new Promise(f => setTimeout(f, 90));
    this.displayMedios=true;
  }

  async filtrar() {
    var filtrosElegidos = this.filtroForm.get('filtros')?.value;
    console.log(filtrosElegidos);
    this.anunciosAFiltrar = this.anuncios;
    var anunciosEncontrados = true;
    filtrosElegidos.forEach(async (element: any) => {
      await new Promise(f => setTimeout(f, 90));
      switch (element.item_id) {
        case "Fechas": {
          var fechaInicio = this.filtroForm.get('fechaStart')?.value;
          var fechaFin = this.filtroForm.get('fechaEnd')?.value;
          await new Promise(f => setTimeout(f, 30));
          // this.destinatarios = this.destinatarios.filter(o => { return o.areaAsignada._id === area._id }).slice();
          this.anunciosAFiltrar = this.anunciosAFiltrar.filter(o => { return o.fechaCreacion > fechaInicio && o.fechaCreacion < fechaFin });
          break;
        }
        case "Medio": {
          var medioElegido = this.filtroForm.get('medio')?.value;
          var anuncios = new Array<Anuncio>();
          //await new Promise(f => setTimeout(f, 140));
          this.anuncios.forEach( async (anuncio: Anuncio) => {
            await new Promise(f => setTimeout(f, 70));
            anuncio.medios.forEach(async element => {
              await new Promise(f => setTimeout(f, 50));
              console.log(medioElegido);
              console.log(element);
              console.log(anuncio.tvSelected);
              if (element.nombre == medioElegido) {
                anuncios.push(anuncio);
              }
              else if (medioElegido == "TV"){
                console.log("TV");
                if (anuncio.tvSelected == true) {
                  console.log("TV IF");
                  anuncios.push(anuncio);
                }
              }
              else if (medioElegido == "Facebook"){
                if (anuncio.fbSelected == true) {
                  anuncios.push(anuncio);
                }
              }
            });
          });
          await new Promise(f => setTimeout(f, 200));
          console.log("si se filtro");
          console.log(this.anunciosAFiltrar);
          console.log(anuncios);
          this.anunciosAFiltrar = anuncios;
          
          break;
        }
        case "Titulo": {
          var titulo = this.filtroForm.get('titulo')?.value;
          await new Promise(f => setTimeout(f, 30));
          this.anunciosAFiltrar = this.anunciosAFiltrar.filter(o => { return o.titulo == titulo });
          break;
        }
        case "Tipo": {
          var tipo = this.filtroForm.get('tipo')?.value;
          console.log(tipo);
          this.anunciosAFiltrar = this.anunciosAFiltrar.filter(o => { return o.tipo === tipo });
          await new Promise(f => setTimeout(f, 30));
          console.log(this.anunciosAFiltrar);
          break;
        }
        case "Estado": {
          var estado = this.filtroForm.get('estado')?.value;
          await new Promise(f => setTimeout(f, 30));
          this.anunciosAFiltrar = this.anunciosAFiltrar.filter(o => { return o.estado == estado });
          break;
        }
        case "Redactor": {
          var redactor = this.filtroForm.get('redactor')?.value;//valor ID
          await new Promise(f => setTimeout(f, 30));
          this.anunciosAFiltrar = this.anunciosAFiltrar.filter(o => { return o.redactor._id == redactor });
          break;
        }
        case "Destinatario": {
          var destinatario = this.filtroForm.get('destinatario')?.value;//valor ID
          await new Promise(f => setTimeout(f, 30));
          var anuncios = new Array<Anuncio>();
          await new Promise(f => setTimeout(f, 70));
          this.anunciosAFiltrar.forEach(async (anuncio: Anuncio) => {
            await new Promise(f => setTimeout(f, 50));
            anuncio.destinatarios.forEach(element => {
              if ( element.nombreRol == destinatario) {
                anuncios.push(anuncio);
              }
            });
          });
          await new Promise(f => setTimeout(f, 90));
          this.anunciosAFiltrar = anuncios;
          await new Promise(f => setTimeout(f, 90));
          break;
        }
      }
      await new Promise(f => setTimeout(f, 80));
    });
    await new Promise(f => setTimeout(f, 200));
    console.log(this.anunciosAFiltrar);
  }

  redirect(link:string){
    this.rout.navigateByUrl('anuncios/descripcion?id='+link);
  }

  ngOnInit(): void {
  }

}
