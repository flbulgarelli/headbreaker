//1 - Sugerencia diaria

//Asumamos que habíamos modelado
class Sugerencia{
  List<Atuendo> atuendos
}


//Podemos hacer

public class AsesorDeImagen implements GeneradorSugerencias {
    private Sugerencia listaAtuendos;
}

//--> Ojo a nivel instancias

class Usuario {
  //(...)
  Sugerencia sugerenciaDiaria;

  Sugerencia getSugerenciaDiaria(){...}
}

//-> Hay gente que guardó listas de sugerencias. No parece tener mucho sentido (no sé si estaba de antes) (?)









//2 - Disparar calculo diario

//El empleado...
class Empleado {
  ServicioMeteorologico servicioMeteorologico
  List<Usuario> usuarios

  calcularSugerenciasDiarias() {
    usuarios.forEach(usuario => usuario.calcularSugerenciaDiaria()
  }

}

class Usuario {
  //(...)
  Sugerencia sugerenciaDiaria;

  Sugerencia getSugerenciaDiaria(){...}


    calcularSugerencia() {
      //Cálculo de sugerencias, puede delegar en otros componentes
    }
    calcularSugerenciaDiaria() {
      this.sugerenciaDiaria = calcularSugerencia()
    }
}

//---
class ListaUsuarios {
	// Singleton
	List<Usuario> usuarios

    void calcularSugerencias() {
       usuarios.forEach(usuario -> usuario.pedirSugerencia() )
    }
}

//----
class RepositorioUsuarios{
  List<Usuario> usuarios;

  List<Usuario> getUsuarios(){...}

}

//--> Podría ser un Singleton

class AsesorDeImagen {
  (...)
  RepositorioUsuarios repoUsuarios;

  void calcularSugerenciasDiarias() {
    repoUsuarios.getUsuarios().forEach(usuario -> usuario.calcularSugerenciaDiaria())
  }
}

//-> Ojo con meterse a hacer planificadores y cosas similares antes de tiempo

//3 Conocer últimas alertas

class Usuario {
  //(...)
  List<String> alertasActuales = new ArrayList<>();
}




//-> Ojo que son únicas para todo el sistema









class ListaAlertas {
	ServicioMeteorologico servicioMeteorologico;
	Map<String, Object> alertas
}












//-> Ojo con acoplarse a la API

//-----
public class GestorDeAlertas {
  ServicioMeteorologico servicioMeteorologico;
	List<String> alertasActuales = new ArrayList<>();
}












//-> Ojo con el nombre 'gestor'

//----
public class RegistroAlertas {
   ServicioMeteorologico servicioMeteorologico;
	 List<String> alertasActuales = new ArrayList<>();
}













//-> Podria ser un objeto dedicado o no
//-> Ojo con strings

//-----

enum AlertaMeteorologica {
  TORMENTA,
  GRANIZO
}

class ServicioMeteorológico {
  List<AlertaMeteorologica> alertasActuales = new ArrayList<>();
}








//4 - Actualizar altertas periódicamente
public class RegistroAlertas {
	 List<AlertaMeteorologica> alertasActuales = new ArrayList<>();

	 public void actualizarAlertas() {
		 this.alertasActuales = new ServicioMeteorologicoAccuWeather().getAlertasMeteorologicas();
	 }

}

class ServicioMeteorologicoAccuWeather implements ServicioMeteorologico {
  List<AlertaMeteorologica> adaptarListaDeAlertas(List<String> alertas) {
    //convierto una lista de strings a una lista de los enums de mi dominio
  }

  List<AlertaMeteorologica> getAlertasMeteorologicas() {
      AccuWeatherAPI apiClima = new AccuWeatherAPI();
      Map<String, Object> alertas = apiClima.getAlertas("Buenos Aires");
      return adaptarListaDeAlertas(alertas.get("CurrentAlerts"));
    }

}




//-> Si no es posible hacer ese new, puedo inyectar el servicio meteorológico










//5+ - Acciones ante alertas

public class RegistroAlertas {
	 List<AlertaMeteorologica> alertasActuales = new ArrayList<>();

	 public void actualizarAlertas() {
		 this.alertasActuales = new ServicioMeteorologicoAccuWeather().getAlertasMeteorologicas();
     this.realizarAccionesSobreAlertas(this.alertasActuales)
	 }

   public void realizarAccionesSobreAlertas(alertas){
     new MailSender().send(...)
     if(alertas.contains(AlertaMeteorologica.TORMENTA)){
       new NotificationService().notify("Lleva Paraguas")
     }else if (alertas.contains(AlertaMeteorologica.GRANIZO)) {
       new NotificationService().notify("No salgas en auto")
     }
     (...)
   }

}

//-> Qué problemas hay?








//Definimos interfaces salientes para usar despues y nos despreocupamos por ahora
interface Correo{
  public enviarCorreo(Usuario user, String cuerpo);
}

interface Notificador{
  public notificar(String mensaje);
}











//Definimos la idea de interesados genéricos
public interface AccionConfigurable {
	public void nuevasAlertasMeteorologicas()
}

public class RegistroAlertas {
	 List<AlertaMeteorologica> alertasActuales = new ArrayList<>();
   List<AccionConfigurable> accionesConfigurables = new ArrayList<>();


	 public void actualizarAlertas() {
		 this.alertasActuales = new ServicioMeteorologicoAccuWeather().getAlertasMeteorologicas();
     this.realizarAccionesSobreAlertas(this.alertasActuales)
	 }

   public void realizarAccionesSobreAlertas(List<AlertaMeteorologica> alertas){
     accionesConfigurables.forEach(accion -> accion.nuevasAlertasMeteorologicas())
   }

}

public class AccionDeMandarMail implements AccionConfigurable {

	@Override
	public void nuevasAlertasMeteorologicas() {
		new Correo().enviarCorreo(???,"Hay nuevas alertas ")
	}

}

//-> Falta el usuario
//-> Las acciones son configurables a nivel usuario

//Opcion A -> interesados en el registro
public interface AccionConfigurable {
	public void nuevasAlertasMeteorologicas();
	public void suscribirUsuario(Usuario usuario);
	public void desuscribirUsuario(Usuario usuario);
}

public class AccionDeMandarMail implements AccionConfigurable {

	List<Usuario> usuariosInteresados = new ArrayList<>();

	@Override
	public void nuevasAlertasMeteorologicas() {
		usuariosInteresados.forEach(usuario-> new Correo().enviarCorreo(usuario.correoElectronico,"Hay nuevas alertas meteorológicas..." /*Imprimir las alertas sacadas del Gestor de Alertas*/));
	}

	public void suscribirUsuario(Usuario usuario) {
		usuariosInteresados.add(usuario);
	}
	public void desuscribirUsuario(Usuario usuario) {
		usuariosInteresados.remove(usuario);
	}
}

public class NotificadorAnteAlertas implements AccionConfigurable {

	List<Usuario> usuariosInteresados = new ArrayList<>();

	public void nuevasAlertasMeteorologicas() {
		if(RegistroAlertas.instance().getAlertasActuales().contains(AlertaMeteorologica.TORMENTA)){
			usuariosInteresados.forEach(usuario -> new Notificador().notificar("Sali con paraguas!"));
		}else	if(RegistroAlertas.instance().getAlertasActuales().contains(AlertaMeteorologica.GRANIZO)) {
			usuariosInteresados.forEach(usuario -> new Notificador().notificar("No salgas en auto!"));
		}
	}
}

//-> Acoplamiento innecesario con el registro. No hace falta q sea singleton!

public class RegistroAlertas {
	 List<AlertaMeteorologica> alertasActuales = new ArrayList<>();
   List<AccionConfigurable> todasLasAccionesPosibles = new ArrayList<>();

   public void realizarAccionesSobreAlertas(List<AlertaMeteorologica> alertas){
     accionesConfigurables.forEach(accion -> accion.nuevasAlertasMeteorologicas(this))
   }
}


List<Usuario> usuariosInteresados = new ArrayList<>();

public void nuevasAlertasMeteorologicas(RegistroAlertas registro) {
    if(registro.getAlertasActuales().stream().contains(AlertaMeteorologica.TORMENTA)){
      usuariosInteresados.forEach(usuario -> new Notificador().notificar("Sali con paraguas!"));
    }else if(registro.getAlertasActuales().contains(AlertaMeteorologica.GRANIZO)) {
      usuariosInteresados.forEach(usuario -> new Notificador().notificar("No salgas en auto!"));
    }
  }
}

//-> Es medio rebuscado
//-> el regsitro deberia conocer a todas las acciones posibles y luego cada usuario suscribirse
//-> El registro es un objeto a nivel 'sistema'

//Opcion B -> Delegamos al usuario









public class RegistroAlertas {
	 List<AlertaMeteorologica> alertasActuales = new ArrayList<>();
   RepositorioUsuarios repoUsuarios;


	 public void actualizarAlertas() {
		 this.alertasActuales = new ServicioMeteorologicoAccuWeather().getAlertasMeteorologicas();
     this.realizarAccionesSobreAlertas(this.alertasActuales)
	 }

   public void realizarAccionesSobreAlertas(List<AlertaMeteorologica> alertas){
     repoUsuarios.getUsuarios().forEach(usuario -> usuario.realizarAccionesSobreAlertas(alertas))
   }

}

class Usuario {
  //(...)
   List<AccionConfigurable> accionesConfigurables = new ArrayList<>();

  public void realizarAccionesSobreAlertas(List<AlertaMeteorologica> alertas){
    accionesConfigurables.forEach(accion -> accion.nuevasAlertasMeteorologicas(this));
  }
}

public interface AccionConfigurable {
	public void nuevasAlertasMeteorologicas(Usuario usuario);
}

public class NotificadorAnteAlertas implements AccionConfigurable {

	public void nuevasAlertasMeteorologicas(Usuario usuario) {
    if(???.getAlertasActuales().contains(AlertaMeteorologica.TORMENTA){
      new Notificador().notificar("Sali con paraguas!");
    }else if(???.getAlertasActuales().contains(AlertaMeteorologica.GRANIZO) {
      new Notificador().notificar("No salgas en auto!");
    }
	}
}

//Nos faltan las alertas!
// No pasa naranja 😎

class Usuario {
  //(...)
   List<AccionConfigurable> accionesConfigurables = new ArrayList<>();

  public void realizarAccionesSobreAlertas(List<AlertaMeteorologica> alertas){
    accionesConfigurables.forEach(accion -> accion.notficarActualizacionDeAlertas(this, alertas));
  }

  agregarAccion(AccionConfigurable accion){
    this.accionesConfigurables.add(accion)
  }

  removerAccion(AccionConfigurable accion){
    this.accionesConfigurables.remove(accion)
  }

}

public interface AccionConfigurable {
	public void nuevasAlertasMeteorologicas(Usuario usuario, List<AlertaMeteorologica> alertas);
}

public class NotificadorAnteAlertas implements AccionConfigurable {

	public void nuevasAlertasMeteorologicas(Usuario usuario, List<AlertaMeteorologica> alertas) {
    if(alertas.contains(AlertaMeteorologica.TORMENTA)){
      new Notificador().notificar("Sali con paraguas!");
    }else if(alertas.contains(AlertaMeteorologica.GRANIZO)) {
      new Notificador().notificar("No salgas en auto!");
    }
	}
}

//-> Type test medio raro
//-> Logica repetida al enviar la notificacion


class NotificadorAnteAlertas implements AccionConfigurable {

  Map<AlertaMeteorologica, String> mensajes = {...}

	nuevasAlertasMeteorologicas(alertasNuevas, usuario) {
    alertasNuevas.forEach(alerta ->
      new Notificador().notificar(mensajes.get(alerta))
    )
	}
}

// Sin el if

class NotificadorAnteAlertas implements AccionConfigurable {
	nuevasAlertasMeteorologicas(alertasNuevas, usuario) {
    alertasNuevas.forEach(alerta ->
      new Notificador().notificar(alerta.getMensaje())
    )
	}
}


enum Alerta{
  TORMENTA(){
    getMensaje(){
      return "lleva paraguas"
    }
  }
}


//-->Puede andar pero --> OJO el mensaje de la notificacion esta 100% definido SOLO por la alerta?
//--> Si el mensaje de notificacion es uno, pero el q se manda x mail o whatsapp es otro?
//--> Tal vez el if no sea tan malo, aparte nos dijeron que no cambiaba eso













//Y separar los interesados?

class TormentaObserver implements AccionConfigurable {
	nuevasAlertasMeteorologicas(alertasNuevas, usuario) {
	if(alertas.contains(AlertaMeteorologica.TORMENTA)){
			new Notificador().notificar("Sali con paraguas!")
		}
	}
}

class GranizoObserver implements AccionConfigurable {
	nuevasAlertasMeteorologicas(alertasNuevas, usuario) {
		if(alertas.contains(AlertaMeteorologica.GRANIZO)){
       // Ojo con cosas del estilo usuario.enviarNotificacion -> Puede ser pasamanos
			new Notificador().notificar("No salgas en auto!");
		}
	}
}

//-> Interesados q reaccionan ante una sola alerta -> raro, mezcla eventos con interesados
//---> Habria q ver bien q quiero

//Antes de seguir: Cuál es el evento?  ----> La actualizacion de las alertas -> el mensaje `nuevasAlertasMeteorologicas`

//Quiénes son los interesados?  -----> Las acciones configurables

//Qué son Tormenta/Granizo? ----> Son como un "parametro" del actualizacion de las alertas












//Opción Alternativa: Ver TORMENTA/GRANIZO como eventos separados

//Observado
class Usuario {
  //(...)
   List<AccionConfigurable> accionesConfigurables = new ArrayList<>(); //Interesados-Observers

  public void realizarAccionesSobreAlertas(List<AlertaMeteorologica> alertas){
    //El type test lo podemos resolver con las estrategias que ya conocemos
    if(alertas.contains(AlertaMeteorologica.TORMENTA)){
      accionesConfigurables.forEach(accion -> accion.nuevaAlertaTormenta(this));
    }else if(alertas.contains(AlertaMeteorologica.GRANIZO)) {
      accionesConfigurables.forEach(accion -> accion.nuevaAlertaGranizo(this));
    }
  }
}

public interface AccionConfigurable { //Eventos
	public void nuevaAlertaTormenta(Usuario usuario);
  public void nuevaAlertaGranizo(Usuario usuario);
}

class NotificadorAnteAlertas implements AccionConfigurable {
	nuevaAlertaTormenta(usuario) {
    new Notificador().notificar("Lleva paraguas")
	}

  nuevaAlertaGranizo(usuario) {
    new Notificador().notificar("No salgas en auto")
	}
}

class RecalculadorSugerencias implements AccionConfigurable {
	nuevaAlertaTormenta(usuario) {
    usuario.calcularSugerenciaDiaria()
	}

  nuevaAlertaGranizo(usuario) {
    usuario.calcularSugerenciaDiaria()
	}
}

//Si en general los interesados hacen cosas diferentes para cada alerta,
//entonces tiene sentido ver a las alertas como eventos separados

//---> Los interesados se interesan en (todos) los eventos del observado
//----> Si quiero separar ya es otro tema (tal vez x listas mejor)
