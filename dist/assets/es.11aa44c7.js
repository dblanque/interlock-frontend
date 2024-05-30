const e="Interlock - Administrador de LDAP",o={home:"Inicio",users:"Usuarios",groups:"Grupos de Seguridad",dns:"DNS",gpo:"GPO",dns_short:"DNS",gpo_short:"GPO",server:"Servidor",settings:"Configuraci\xF3n",logs:"Registro de Eventos",debug:"Debugging",header:{home:"\xC1rbol de Directorio",users:"Usuarios",groups:"Grupos de Seguridad",dns:"Servidor de Nombre de Dominio",gpo:"Objetos de Pol\xEDtica de Grupo",server:"Administraci\xF3n de Servidor",settings:"Configuraci\xF3n",logs:"Registro de Eventos",debug:"Debugging para Desarrolladores"}},r={commonlyUsed:"Com\xFAnmente Utilizado",ldap:{configPreset:"Grupo de Par\xE1metros",newConfigPreset:"Nombre de Par\xE1metros Nuevo",defaultPreset:"Par\xE1metros Pre-determinados",manual_command:"Comando LDAP Manual",operation:"Operaci\xF3n LDAP",operation_list:{ADD:"A\xF1adir (Add)",DELETE:"Eliminar (Delete)",MODIFY:"Modificar (Modify)",MODIFYDN:"Modificar DN (Modify-dn)",SEARCH:"Buscar (Search)",COMPARE:"Comparar (Compare)",EXTENDED:"Extendida (Extended)"},filter:"Filtro LDAP"},runExecute:"Ejecutar",expirePwd:"Expirar Contrase\xF1a",extra:"Extra",moreActions:"M\xE1s Acciones",refreshToken:"Refrescar Token de Acceso",import:"Importar",export:"Exportar",groupBy:"Agrupar por",filter:"Filtrar",rename:"Renombrar",openAll:"Abrir todos",closeAll:"Cerrar todos",unlock:"Desbloquear",resetFilters:"Borrar Filtros",backToLogin:"Volver a iniciar sesi\xF3n",testSettings:"Probar Configuraci\xF3n",restoreDefaultValues:"Restaurar Valores Originales",areYouSure:"\xBFEsta seguro de querer",label:"Acciones",revert:"Revertir",done:"Listo",enable:"Habilitar",disable:"Des-habilitar",clickTo:"Clickee para",move:"Mover",changePassword:"Cambiar Contrase\xF1a",changeEnduserPassword:"Cambiar su Contrase\xF1a",goToLink:"Ir a Enlace",goTo:"Ir a",search:"Buscar",yes:"Si",no:"No",apply:"Aplicar",addF:"Nueva",addM:"Nuevo",addN:"A\xF1adir",previous:"Anterior",back:"Volver",back_short:"Volver",confirm:"Confirmar",edit:"Editar",view:"Ver",delete:"Borrar",remove:"Remover",reset:"Reiniciar",isRequired:"es requerido",isNotValid:"debe ser v\xE1lido",submit:"Enviar",Select:"Seleccionar",create:"Crear",save:"Guardar",saveClose:"Guardar y Cerrar",close:"Cerrar",next:"Siguiente",cancel:"Cancelar",click:"Clickear",block:"Bloquear",unblock:"Desbloquear",verify:"Verificar",unverify:"Des-verificar",language:"Lenguaje",expires:"Vence",approve:"Aprobar",reject:"Rechazar",refresh:"Refrescar",loading:"Cargando",loading_long:"Cargando, por favor aguarde",download:"Descargar",downloadLatest:"Descargar \xDAltimo",changeUserPerms:"Ver Permisos",massChangeUserPerms:"Cambiar Permisos",changeUserGroups:"Ver Grupos",addObjectClass:"A\xF1adir Clase de Objeto",passwordChanged:"Contrase\xF1a Modificada"},a={created:{m:"Creado | Creados",f:"Creada | Creadas",n:"Creado | Creados"},updated:{m:"Modificado | Modificados",f:"Modificada | Modificadas",n:"Modificado | Modificados"},deleted:{m:"Eliminado | Eliminados",f:"Eliminada | Eliminadas",n:"Eliminado | Eliminados"},saved:{m:"Guardado | Guardados",f:"Guardada | Guardadas",n:"Guardado | Guardados"},renamed:{m:"Renombrado | Renombrados",f:"Renombrada | Renombradas",n:"Renombrados | Renombrados"},all:{m:"Todo | Todos",f:"Toda | Todas",n:"Todo | Todos"},none:{m:"Ninguno",f:"Ninguna",n:"Ninguno"},loaded:{m:"Cargado | Cargados",f:"Cargada | Cargadas",n:"Cargado | Cargados"},unlocked:{m:"Desbloqueado | Desbloqueados",f:"Desbloqueada | Desbloqueadas",n:"Desbloqueado | Desbloqueados"},success:"\xC9xito",skipped:"Omitido",status:"Estado",selected:"Seleccionados",readOnly:"Solo Lectura",member:"Miembro",enabled:"Activado",disabled:"Des-activado",seconds:"Segundos",minutes:"Minutos",hours:"Horas",key:"Clave",value:"Valor",error:"Error",today:"Hoy",filter:"Filtro",legend:"Leyenda",export:"Exportar",maximum:"M\xE1ximo",minimum:"M\xEDnimo",amount:"Monto",costs:"Costos",expiration:"Vencimiento",expiration_ab:"Vto.",at:"El",of:"De",details:"Detalles",list:"Listado",to:"Para",currently:"Actualmente",notes:"Notas",secondaryM:"Secundario",secondaryF:"Secundaria",number:"N\xFAmero",currency:"Divisa",other:"Otro",others:"Otros",processing:"Procesando",date:"Fecha",total:"Total"},i={log:"Evento | Eventos",connection:"Conexi\xF3n | Conexiones",user:"Usuario | Usuarios",contact:"Contacto | Contactos","builtin-domain":"Objeto Integrado | Objetos Integrados",container:"Contenedor | Contenedores",person:"Persona | Personas",group:"Grupo | Grupos",computer:"Computadora | Computadoras",printer:"Impresora | Impresoras","organizational-unit":"Unidad Organizacional | Unidades Organizacionales",ou:"OU | OUs",setting:"Par\xE1metro | Par\xE1metros","setting-preset":"Grupo de Par\xE1metros | Grupos de Par\xE1metros",ldap:"Objeto LDAP | Objetos LDAP","totp-device":"Dispositivo TOTP | Dispositivos TOTP",dns:{zone:"Zona de DNS | Zonas de DNS",record:"Registro de DNS | Registros de DNS"},gpo:{normal:"Objetos de Pol\xEDticas de Grupo | Objeto de Pol\xEDticas de Grupo",short:"GPO | GPOs"}},s={codes:{400:"HTTP 400: Pedido Err\xF3neo",401:"HTTP 401: No Autorizado",403:"HTTP 403: Prohibido",406:"HTTP 406: Inaceptable",409:"HTTP 409: Conflicto",500:"HTTP 500: Error de Servidor",ldapGwError:"Servidor de LDAP Inalcanzable",invalidCSV:"Archivo CSV Inv\xE1lido",invalidCSVHeaders:"Cabecera de CSV Inv\xE1lida",fileReader:"Excepci\xF3n del Lector de Archivos",networkError:"AXIOS: Error de Red",auth:{invalid_credentials:"Credenciales Incorrectos",verification_code:"Codigo Incorrecto, Intente nuevamente",verified_successfully:"Verificado Exitosamente",verification_expired:"Intentos de Verificaci\xF3n acabados, contacte un administrador"},otp:{otp_invalid_code:"C\xF3digo OTP inv\xE1lido",otp_invalid_recovery_code:"C\xF3digo de Respaldo inv\xE1lido",otp_invalid_data:"Datos OTP inv\xE1lidos",otp_required:"Se requiere el C\xF3digo OTP",otp_no_device_registered:"No se registr\xF3 el Dispositivo OTP"},dns:{dns_zone_missing:"Valor de Zona DNS Inv\xE1lido",dns_zone_in_record:"El Registro no debe incluir la Zona",dns_zone_not_deletable:"Esta Zona DNS no puede ser borrada",dns_zone_exists:"La Zona ya existe",dns_zone_does_not_exist:"La Zona no existe",dns_record_not_in_request:"El Registro DNS no se encuentra en el Request",dns_record_dn_missing:"No existe el Nombre Distinguido en ese Registro",dns_record_type_conflict:"La Inserci\xF3n o Modificaci\xF3n genera un conflicto",dns_record_exists_conflict:"Este Registro DNS ya existe",dns_record_type_unsupported:"Tipo de Registro DNS no soportado",dns_record_attr_missing:"Falta un atributo requerido en el Request",dns_record_type_missing:"Falta el tipo de Registro DNS en el Request",dns_record_data_does_not_match:"Los datos del Registro no coinciden con los datos del servidor",dns_record_entry_does_not_exist:"La Entrada LDAP del Registro no existe",dns_record_data_malformed:"El Registro de DNS est\xE1 mal formado",dns_record_serial:"No se pudo establecer el Serial del Registro",dns_soa_fetch:"No se pudo obtener el Registro SOA de la Zona",dns_soa_serial_increment:"No se pudo Incrementar el Serial del SOA",dns_soa_record_root_only:"Solo puede configurar un SOA para la ra\xEDz de su zona",dns_root_servers_only_cli:"Los Servidores DNS de Ra\xEDz solo pueden ser modificados desde la consola",dns_field_validator_failed:"Un campo no fue validado correctamente",dns_list_response_empty:"La Respuesta del LDAP no contiene Zonas de DNS",dns_field_validator_exception:"Excepci\xF3n de Validaci\xF3n de Campos DNS",dns_record_create:"No se pudo crear el Registro DNS"},users:{noUsersInImport:"No hay usuarios en el archivo",user_permission_malformed:"Permisos de Usuario mal-formados",user_passwords_dont_match:"No coinciden las contrase\xF1as del Usuario",user_create_error:"No se pudo crear el Usuario",user_bulk_create_error:"No se pudo crear un Usuario",user_bulk_mapping_error:"Falta o es inv\xE1lida una relaci\xF3n de los cabezales",user_bulk_length_error:"Una fila no tiene la cantidad de campos o delimitadores correcta",user_update_error:"No se pudo modificar el Usuario",user_field_validator_error:"No se pudo validar el Usuario",user_dn_does_not_exist:"No existe un Usuario con ese Nombre Distinguido",user_dn_path_exception:"Excepci\xF3n de Parseo de DN de Usuario",user_anti_lockout:"Excepci\xF3n de Anti-bloqueo de Usuario",user_unlock_error:"No se pudo des-bloquear el Usuario",user_country_error:"No se pudo actualizar el pa\xEDs del Usuario",user_group_fetch_error:"No se pudieron obtener las membres\xEDas de Grupo",user_group_primary_err:"No se puede eliminar el Grupo Primario del Usuario",user_group_bad:"Operaci\xF3n de Miembro de Grupo Inv\xE1lida",user_email_exists:"Ya existe otro Usuario con ese Email"},ldap:{ldap_obj_exists:"Ya existe un objeto con este Nombre Com\xFAn",ldap_connection_not_open:"No se abri\xF3 una Conexi\xF3n LDAP previo a esta Operaci\xF3n",ldap_perm_insufficient:"Permisos de LDAP Insuficientes",ldap_obj_doesnt_exist:"No existe un Objeto LDAP con este Nombre",ldap_bind_err:"No se pudo emparejar con el Servidor LDAP",ldap_tree_err:"No se pudo obtener el Directorio del Servidor LDAP",ldap_port_err:"Puerto de LDAP Inalcanzable",ldap_bind_test_failed:"Conexi\xF3n de Emparejamiento Fallida"},groups:{group_does_not_exist:"El Grupo no existe",group_create:"No se pudo el crear Grupo",group_delete:"No se pudo el eliminar Grupo",group_update:"No se pudo el modificar Grupo",group_member_add:"No se pudieron a\xF1adir miembros al Grupo",group_member_remove:"No se pudieron eliminar miembros del Grupo",group_scope_or_type:"Falta el Alcance o Tipo del Grupo en el Request",group_dn_missing:"Falta el Nombre Distinguido en el Request",group_builtin_protect:"El Grupo especificado es integrado a LDAP y no puede ser eliminado",group_members_bad:"Los mismos miembros estan siendo eliminados y a\xF1adidos"},settings:{setting_type_malformed:"Tipo de Par\xE1metro Malformado",setting_not_in_list:"Par\xE1metro Requerido no encontrado",setting_max_log:"Violaci\xF3n de L\xEDmite de Eventos",setting_reset_fail:"No se pudieron restaurar los valores por defecto",setting_preset_not_exists:"Grupo de Par\xE1metros Inexistente",setting_preset_exists:"Ese Grupo de Par\xE1metros ya existe",settings_serializer_error:"Error de serializaci\xF3n de Par\xE1metros",settings_preset_serializer_error:"Error de Serializaci\xF3n de Grupo de Par\xE1metros",settings_preset_must_be_disabled:"El Grupo de Par\xE1metros debe estar des-habilitado"},ldapObjectExists:"Un Objeto LDAP con ese Identificador ya existe",namingViolation:"Excepci\xF3n de Violaci\xF3n de Nombre (Naming Violation)",unwillingToPerform:"El Servidor LDAP no est\xE1 dispuesto a realizar la acci\xF3n",unwillingToPerformPwd:"Active Directory requiere LDAP con SSL para Modificar Contrase\xF1as"},settings:{testInvalid:"Prueba de Conexi\xF3n LDAP Fallida",serverUnreachable:"Servidor LDAP Inalcanzable"},data:{noCountryCode:"Sin c\xF3digo configurado"},validation:{int32:"Debe ser un n\xFAmero entero de 32 bits",below10000:"El valor num\xE9rico debe ser menor a 10000",aboveZero:"El valor num\xE9rico debe ser mayor a 0",doubleQuotes:"No se permiten las comillas dobles",singleQuotes:"No se permiten las comillas simples",domainRoot:"Debe ser un Nombre de Dominio v\xE1lido (excluir la zona, se permite @ para la ra\xEDz)",ascii:"Los Datos del String deben contener solo Caracteres ASCII",fieldinvalid:"Uno o mas campos son invalidos",fieldRequired:"Este campo es requerido",passwordNotSame:"Las contrase\xF1as no coinciden",alphabetic:"Debe contener solo letras (2 caracteres m\xEDnimo)",numeric:"Debe contener solo n\xFAmeros",max4:"M\xE1ximo de 4 caracteres",max6:"M\xE1ximo de 6 caracteres",max8:"M\xE1ximo de 8 caracteres",max255:"M\xE1ximo de 255 caracteres",alphaNumeric:"Debe ser alfanum\xE9rico",alphaNumericSpecialUsername:"Debe contener solo letras (guiones permitidos)",alphaNumericPassword:"8 caracteres m\xEDn., caracteres especiales permitidos: !@#$%&*()",alphaNumericSpaces:"a-z A-Z 0-9 y Espacios, 2 car. min",alphaNumericSpecial:"a-z A-Z 0-9 -_ y Espacios, 2 car. min",domain:"Debe ser un Dominio de NSG v\xE1lido ( ejemplo.tld | dominio.com )",email:"Debe ser un E-Mail v\xE1lido (Ej.: juan@dominio.com)",phone:"Debe ser un Tel\xE9fono v\xE1lido",date:"Fecha inv\xE1lida",dayDate:"Fecha de D\xEDa inv\xE1lida",ipv4Address:"Direcci\xF3n IPv4 inv\xE1lida",ipv6Address:"Direcci\xF3n IPv6 inv\xE1lida [0-9a-fA-F]",ipv6AddressUri:"La URI IPv6 debe estar encapsulada por corchetes",ipv6AddressLength:"Longitud de Direcci\xF3n IPv6 Inv\xE1lida",ipv6AddressAmbiguous:"Direcci\xF3n IPv6 Ambigua",distinguishedName:"Nombre Distinguido inv\xE1lido",realm:"Reino NT inv\xE1lido",domainCanonical:"Debe ser un Dominio en formato Can\xF3nico (con un punto al final)",totpLength:"El C\xF3digo TOTP debe tener 6 d\xEDgitos"},unableToLoad:"No se pudo cargar la secci\xF3n",notDisplayedCorrectly:"No se pudo obtener un c\xF3digo de error",notFound:"no encontrado",unknown_short:"Un error desconocido ha ocurrido",unknown:"Un error desconocido ha ocurrido, por favor int\xE9ntelo nuevamente"},n={hints:{name:"Utilice el caracter @ para identificar su zona ra\xEDz",serial_create:"Deje el campo vac\xEDo para auto-generar el serial",serial_edit:"Si el serial no es modificado, este ser\xE1 auto-incrementado",stringData:"Inserte el registro sin doble comilla",quotesNotRequired:"Las comillas dobles no son requeridas, son puestas en forma autom\xE1tica"},attributes:{index:"Indice del Registro",infiniteTtl:"TTL Infinito",ttl:"Tiempo de Vida",value:"Valor del Registro",displayName:"Nombre a Mostrar",name:"Nombre del Registro",nameNode:"Nombre del Nodo",nameTarget:"Nombre del Objetivo",ipv4Address:"Direcci\xF3n IPv4",ipv6Address:"Direcci\xF3n IPv6",address:"Direcci\xF3n",type:"Tipo de Registro (Interno)",typeName:"Tipo de Registro",serial:"Serial",ts:"Lapidado",tstime:"Fecha de Lapidaci\xF3n",wPriority:"Prioridad",wWeight:"Peso",wPort:"Puerto",dwSerialNo:"Nro. Serial",dwRefresh:"Refresco",dwRetry:"Reintento",dwExpire:"Expiraci\xF3n",dwMinimumTtl:"Tiempo de Vida M\xEDnimo (TTL)",namePrimaryServer:"Servidor Primario del Nombre",zoneAdminEmail:"E-mail del Admin de Zona",nameExchange:"Nombre del MX",stringData:"Datos del String",wPreference:"Prioridad"}},t={attributes:{realm:"Reino NT",domain:"Dominio",name:"Nombre",objectRid:"Identificador Relativo del Objeto (RID)",objectSid:"Identificador de Seguridad del Objeto (SID)",hasMembers:"Tiene Miembros",sAMAccountName:"Nombre de Cuenta",username:"Nombre de Usuario",givenName:"Nombre",sn:"Apellido",cn:"Nombre Com\xFAn",groupType:"Tipo de Grupo",password:"Contrase\xF1a",passwordConfirm:"Confirmar Contrase\xF1a",initials:"Iniciales",mail:"Email",displayName:"Nombre Completo",is_enabled:"Usuario Habilitado",is_disabled:"Usuario Des-habilitado",last_login:"Ultima vez activo",role:"Rol",is_staff:"Es Empleado",telephoneNumber:"Tel\xE9fono",streetAddress:"Direcci\xF3n",postalCode:"C\xF3digo Postal",l:"Ciudad",st:"Estado / Provincia",countryCode:"Pa\xEDs (C\xF3digo INT)",countryCodeCombined:"Pa\xEDs (C\xF3digos INT / ISO)",c:"Pa\xEDs (C\xF3digo ISO)",co:"Pa\xEDs",wWWHomePage:"P\xE1gina Web",distinguishedName:"Nombre Distinguido",userPrincipalName:"Nombre Principal del Usuario",userPrincipalName_pre2000:"Nombre del Usuario (pre-Windows 2000)",userAccountControl:"Permisos del Usuario (INT Crudo)",whenCreated:"Cuenta creada el",whenChanged:"Cuenta modificada el",lastLogon:"\xDAltimo inicio de sesi\xF3n",badPwdCount:"Contador de Contrase\xF1as Incorrectas",pwdLastSet:"Contrase\xF1a cambiada por \xFAltima vez",primaryGroupID:"ID Primario de Grupo",objectClass:"Clase del Objeto",objectCategory:"Categor\xEDa del Objeto",sAMAccountType:"Tipo de Cuenta"}},d={objectEditor:"Editor de Objeto"},l={tooltip:{fetchDomainDetails:"Refrescar Datos de Dominio",debugAction:"Acci\xF3n de Debugging"}},c={dns:{zoneToAddName:"Nombre de la nueva Zona de DNS",confirmZoneCreation:"Confirmar Creaci\xF3n de Zona",legacyMode:"Utilizando DNS en Modo Legado",legacyMode_hint:"\xBFIntent\xF3 el Modo Legado de DNS?",createSuccess:"Registro Creado",updateSuccess:"Registro Modificado",deleteSuccess:"Registro Eliminado",deleteRecord:{message:"\xBFEst\xE1 seguro de borrar el Registro de DNS"},massAction:{delete:"Los siguientes registros de DNS ser\xE1n eliminados"},deleteZone:{message:"\xBFEst\xE1 seguro de borrar la Zona de DNS",confirmZone:"Por favor confirme re-escribiendo el nombre de la Zona"}},login:{title:"Inicie Sesi\xF3n en su Servidor LDAP",account:"Usuario LDAP",useEmail:"Usar E-Mail",useLDAPUser:"Usar Cuenta LDAP",loginBtn:"Iniciar Sesi\xF3n",useRecoveryCode:"Usar C\xF3digo de Respaldo",forgotMyPassword:"Olvid\xE9 mi Contrase\xF1a",tooManyLogins:"Ha sido deshabilitado",tryAgain:"Int\xE9ntelo nuevamente",oneRetryLeft:"intento restante",retriesLeft:"intentos restantes"},logs:{resetDialog:{header:"Borrar Registros de Eventos",message:"\xBFEst\xE1 seguro de borrar <b>todos</b> los registros de evento?"},truncateDialog:{header:"Truncar Registros de Eventos",message:"\xBFEst\xE1 seguro de truncar los registros de evento?"},extras:{totp_delete:"Se elimin\xF3 el Dispositivo TOTP",move:"El objeto fue movido",rename:"El objeto fue renombrado",end_user_updated:"El usuario modific\xF3 sus detalles",changed_password:"La contrase\xF1a del Usuario cambi\xF3",disable:"El usuario fue des-habilitado",enable:"El usuario fue habilitado",unlock:"El usuario fue des-bloqueado"},headers:{date:"Fecha de Evento",user:"Usuario Responsable",affectedObject:"Objeto(s) Afectado(s)",actionType:"Tipo de Acci\xF3n",objectClass:"Clase del Objeto",extraMessage:"Detalles Extra",id:"ID de Evento"},prevValue:"Valor Anterior",newValue:"Nuevo Valor",seeDetails:"Ver Detalles",viewAction:{truncate:{slider:"Rango a Truncar",button:"Truncar Registros",max:"M\xE1x",min:"M\xEDn"}},actionType:{CREATE:"Creaci\xF3n",READ:"Lectura",UPDATE:"Modificaci\xF3n",DELETE:"Baja",LOGIN:"Inicio de Sesi\xF3n",LOGOUT:"Cierre de Sesi\xF3n",OPEN:"Apertura",CLOSE:"Cierre"}},enduser:{title:"Bienvenido",helpMessage:"Debajo puede modificar su contrase\xF1a y detalles de usuario de Active Directory / LDAP"},dirtree:{deleteObject:{title:"Borrar Objeto LDAP",message:"\xBFEst\xE1 seguro de borrar el objeto"},ouCreate:{step1:"Detalles de la Unidad Organizacional",step2:"Unidad Organizacional Creada",step2_success:"Unidad Organizacional Creada Exitosamente",ouCreatedIn:"La Unidad ser\xE1 creada en"},computerCreate:{step1:"Detalles de la Computadora",step2:"Computadora Creada",step2_success:"Computadora Creada Exitosamente",computerCreatedIn:"La Computadora ser\xE1 creada en"},printerCreate:{step1:"Detalles de la Impresora",step2:"Impresora Creada",step2_success:"Impresora Creada Exitosamente",printerCreatedIn:"La Impresora ser\xE1 creada en"},filterHint:"Clickee los chips azules para filtrarlos",rename:{title:"Renombrar Objeto LDAP",originalDistinguishedName:"Nombre Distinguido Original",success:"Objeto LDAP renombrado exitosamente"},move:{setToRoot:"Seleccionar Ra\xEDz de Dominio",title:"Mover Objeto de Dominio",willBeMovedTo:"Ser\xE1 movido a",originalRelativePath:"Camino Relativo Original",success:"Objeto LDAP movido exitosamente"}},users:{userCreate:{header:"Crear Usuario",optionalsHeader:"Detalles Opcionales",validationError:"Error de Validaci\xF3n",domainRealmError:"Error de par\xE1metros de dominio, por favor re-abra este componente",userCreatedIn:"El usuario ser\xE1 creado en",step1:"Detalles del Usuario",step2:"Contrase\xF1a y Permisos",step3:"Usuario Creado",step3_success:"Usuario Creado Exitosamente"},resetPasswordDialog:{title:"Blanqueo de Contrase\xF1a",changePasswordForUser:"Cambiar\xE1 la contrase\xF1a del usuario",complexity:{title:"Recomendaciones de Complejidad de Contrase\xF1a",letters:"Letras may\xFAscula o min\xFAsucla (A-Z / a-z)",numbers:"Caracteres Num\xE9ricos (0-9)",symbols:"Caracteres No-Alfanum\xE9ricos como $, # o %",dontMatchUser:"No m\xE1s que dos s\xEDmbolos del nombre de usuario o nombre visible"}},userDialog:{deleteTotp:"Eliminar Dispositivo TOTP",noLastLogon:"El usuario a\xFAn no ha iniciado sesi\xF3n",userDetails:"Detalles de Usuario",addToGroup:"A\xF1adir a Grupo",removeFromGroup:"Remover del Grupo",primaryGroupRemoveDisabled:"El grupo primario no puede ser removido",containsGroups:"Contiene Grupos",doesNotContainGroups:"No contiene Grupos",hint:{addObjectClass:"Mejor que sepa lo que hace",primaryGroupID:"Solo modifique este valor si tiene Clientes Macintosh o Aplicaciones que utilicen POSIX"}},userBulkUpdate:{title:"Actualizaci\xF3n M\xFAltiple de Usuarios",modifiedAttributes:"Atributos Modificados"},import:{title:"Importaci\xF3n de Usuarios",fileToUpload:"Cargar Listado de Usuarios",supportedExtensions:"<b>.csv</b>, <b>.tsv</b>, o <b>.txt</b> separado por <b>comas</b> o <b>tabs</b><br> no borre la cabecera",fileReady:"Archivo listo para importar",fileCleared:"Archivo Eliminado",importOptions:"Opciones de Importaci\xF3n",usePlaceholderPassword:"Usar Password Temporaria",dataMapping:"Mappeo de Campos de Usuario",editUserMappings:"Editar Mappeo de Campos",uploadFile:"Cargar Archivo",previewData:"Pre-visualizar Datos",previewMode:"Pre-visualizacion de Usuarios a Importar",readyToImport:"Archivo listo para Importar",downloadTemplate:"Descargar Plantilla CSV",bulkImportSuccess:"Usuarios Importados Exitosamente",bulkImportPartial:"Usuarios Importados con Errores",error:{validation:"Error de Validaci\xF3n de Campo",permission:"Error de Parseo (Permisos)",country:"Error de Parseo (Pa\xEDs), ver ISO-3166",create:"No se pudo crear el Usuario LDAP",password:"No se pudo modificar la Contrase\xF1a LDAP"}},export:{title:"Exportaci\xF3n de Usuarios"},youAreHere:"Usted est\xE1 aqu\xED",userUnlocked:"Usuario desbloqueado Exitosamente",errorUserUnlock:"Error al desbloquear el Usuario",tryingToDisable:"Est\xE1 intentando des-habilitar",disablingOwnUser:"No puede des-habilitar su propio usuario",antiLockoutWarning:"Alerta Anti-bloqueo",basicDetails:"Detalles B\xE1sicos",location:"Ubicaci\xF3n",perms:"Permisos del Usuario",groups:"Grupos del Usuario",editFlagWarning:"Est\xE1 editando el usuario",viewFlagWarning:"Est\xE1 viendo el usuario",permsRaw:"Salida en Crudo",permsRawHint:"Clickee aqu\xED para abrir documentaci\xF3n de Microsoft sobre Permisos de LDAP",permsCalc:"N\xFAmero Int. de Permisos Calculado",permsOutputArray:"Lista/Array a enviar",advancedDetails:"Detalles Avanzados",deleteUser:{title:"Borrar Usuario",message:"\xBFEst\xE1 seguro de borrar el usuario",mass:"\xBFEst\xE1 seguro de borrar en masa los usuarios seleccionados",success:"Operaci\xF3n de Borrado Completa"},permissions:{LDAP_UF_SCRIPT:"Usuario de Script",LDAP_UF_ACCOUNT_DISABLE:"Des-habilitar Cuenta de Usuario",LDAP_UF_HOMEDIR_REQUIRED:"Directorio Base Requerido",LDAP_UF_LOCKOUT:"Cuenta Bloqueada",LDAP_UF_PASSWD_NOTREQD:"El Usuario no requiere Contrase\xF1a",LDAP_UF_PASSWD_CANT_CHANGE:"El Usuario no puede cambiar la Contrase\xF1a",LDAP_UF_ENCRYPTED_TEXT_PASSWORD_ALLOWED:"Permitir texto encriptado en la Contrase\xF1a",LDAP_UF_NORMAL_ACCOUNT:"Cuenta Normal",LDAP_UF_INTERDOMAIN_TRUST_ACCOUNT:"Cuenta Inter-dominio Confiable",LDAP_UF_WORKSTATION_TRUST_ACCOUNT:"Cuenta de Estaci\xF3n de Trabajo Confiable",LDAP_UF_SERVER_TRUST_ACCOUNT:"Cuenta de Servidor Confiable",LDAP_UF_DONT_EXPIRE_PASSWD:"Contrase\xF1a sin expiraci\xF3n",LDAP_UF_MNS_LOGON_ACCOUNT:"Cuenta de Inicio con MNS",LDAP_UF_SMARTCARD_REQUIRED:"Requiere Tarjeta Inteligente (Smart-Card)",LDAP_UF_TRUSTED_FOR_DELEGATION:"Confiable para delegar",LDAP_UF_NOT_DELEGATED:"Cuenta no delegada",LDAP_UF_USE_DES_KEY_ONLY:"Usa Clave DES exclusivamente",LDAP_UF_DONT_REQUIRE_PREAUTH:"No requiere Pre-Autenticaci\xF3n",LDAP_UF_PASSWORD_EXPIRED:"Contrase\xF1a Expirada",LDAP_UF_TRUSTED_TO_AUTHENTICATE_FOR_DELEGATION:"Confiable para Autenticar Delegados",LDAP_UF_NO_AUTH_DATA_REQUIRED:"No requiere Datos de Autenticaci\xF3n",LDAP_UF_PARTIAL_SECRETS_ACCOUNT:"Cuenta de Secretos Parciales"}},groups:{groupBuiltinCannotDelete:"Este grupo es del sistema o est\xE1 protegido",editFlagWarning:"Est\xE1 editando el grupo",isPopulated:"El grupo tiene miembros",isNotPopulated:"El grupo no tiene miembros",types:{GROUP_DISTRIBUTION:"Grupo de Distribuci\xF3n",GROUP_SYSTEM:"Creado por el Sistema",GROUP_GLOBAL:"Alcance Global",GROUP_DOMAIN_LOCAL:"Alcance Local de Dominio",GROUP_UNIVERSAL:"Alcance Universal",GROUP_SECURITY:"Grupo de Seguridad"},groupCreate:{header:"Crear Grupo",step1:"Detalles del Grupo",step2:"Miembros del Grupo",step3:"Grupo Creado",step3_success:"Grupo Creado Exitosamente",optionalsHeader:"Detalles Opcionales",groupCreatedIn:"El Grupo ser\xE1 creado en",memberAddError:"Error al a\xF1adir el miembro, por favor intente nuevamente"},groupDialog:{groupType:"Tipo de Grupo",groupScope:"Alcance del Grupo",members:"Miembros del grupo",copyDistinguishedName:"Copiar Nombre Distinguido"},deleteGroup:{title:"Borrar Grupo",message:"\xBFEst\xE1 seguro de borrar el grupo"}},settings:{superAdminIs:"S\xFAper-Administrador",superAdminPwd:"Cambiar Contrase\xF1a de Admin. Local",superAdminPwdConfirm:"Confirmar nueva Contrase\xF1a",configLabelFieldHint:"Clickee Guardar para Renombrar",activePreset:"Grupo de Par\xE1metros Activo",resetDialog:{header:"Re-establecer Configuraci\xF3n",message:"\xBFEst\xE1 seguro de re-establecer <b>todos</b> los par\xE1metros?"},testSuccess:"Conexi\xF3n LDAP exitosa",settingFailedValidation:"Un par\xE1metro ha fallado la validaci\xF3n",headers:{log:"Historial",domain:"Dominio",bindUser:"Usuario de Conexi\xF3n",connection:"Conexi\xF3n",filters:"Filtros"},fields:{LDAP_LOG_MAX:"Cantidad M\xE1xima de Eventos Registrados",LDAP_LOG_READ:"Registrar Eventos de LECTURA",LDAP_LOG_CREATE:"Registrar Eventos de ALTA",LDAP_LOG_UPDATE:"Registrar Eventos de MODIFICACI\xD3N",LDAP_LOG_DELETE:"Registrar Eventos de BAJA",LDAP_LOG_OPEN_CONNECTION:"Registrar Eventos al ABRIR CONEXI\xD3N LDAP",LDAP_LOG_CLOSE_CONNECTION:"Registrar Evento al CERRAR CONEXI\xD3N LDAP",LDAP_LOG_LOGIN:"Registrar Inicios de Sesi\xF3n en Interlock",LDAP_LOG_LOGOUT:"Registrar Cierres de Sesi\xF3n en Interlock",LDAP_URI_PREFIX:"Prefijo LDAP",LDAP_URI_IP:"Direcci\xF3n IP del Servidor",LDAP_URI_PORT:"Puerto del Servidor",LDAP_URI_PORT_HINT:"Rango V\xE1lido: 1-65535",LDAP_AUTH_URL:"Servidores LDAP",LDAP_AUTH_URL_HINT:"A\xF1adir un servidor a lista",LDAP_DOMAIN:"Dominio LDAP",LDAP_DOMAIN_HINT:"Ejemplo: dominio.com",LDAP_PORT:"Puerto del Servidor LDAP",LDAP_PORT_HINT:"Pre-determinado: 389 (Non-TLS), 636 (TLS)",LDAP_DNS_LEGACY:"DNS Modo Legacy",LDAP_DNS_LEGACY_HINT:"Pruebe este par\xE1metro si su secci\xF3n de DNS no funciona correctamente",LDAP_AUTH_SEARCH_BASE:"Base de B\xFAsqueda de LDAP/AD",LDAP_AUTH_SEARCH_BASE_HINT:"Ejemplo: dc=dominio,dc=com",LDAP_AUTH_ACTIVE_DIRECTORY_DOMAIN:"Reino / Dominio de Autenticaci\xF3n de AD",LDAP_AUTH_ACTIVE_DIRECTORY_DOMAIN_HINT:"Ejemplo: DOMINIO",LDAP_AUTH_CONNECTION_USER_DN:"DN de Usuario de Conexi\xF3n",LDAP_AUTH_CONNECTION_PASSWORD:"Contrase\xF1a de Usuario de Conexi\xF3n",LDAP_AUTH_CONNECT_TIMEOUT:"Tiempo de Espera para la Conexi\xF3n de Autenticaci\xF3n LDAP",LDAP_AUTH_RECEIVE_TIMEOUT:"Tiempo de Espera para recibir la respuesta de Autenticaci\xF3n LDAP",LDAP_AUTH_USE_SSL:"Usar SSL",LDAP_USE_SSL_HINT:"Requiere utilizar el prefijo ldaps://",LDAP_AUTH_USE_SASL:"Usar SASL (GSSAPI)",LDAP_AUTH_USE_TLS:"Usar TLS",LDAP_AUTH_TLS_VERSION:"Versi\xF3n de TLS",LDAP_AUTH_TLS_VERSION_HINT:"El valor Pre-determinado es PROTOCOL_TLSv1_2",ADMIN_GROUP_TO_SEARCH:"Filtro DN de Grupo Administrador",LDAP_AUTH_OBJECT_CLASS:"Clase de Objeto de Autenticaci\xF3n",EXCLUDE_COMPUTER_ACCOUNTS:"Excluir Objetos de Computadoras",LDAP_AUTH_USER_FIELDS:"Mappeo de Campos de LDAP",LDAP_AUTH_USER_LOOKUP_FIELDS:"Campos de B\xFAsqueda del Usuario"}},debug:{ldapOperation:"Operaci\xF3n de LDAP | Operaciones de LDAP",asAdmin:"Ejecutar como Usuario Ra\xEDz de Conexi\xF3n LDAP",asUser:"Ejecutar como Usuario Actual"}},u={fname:"Nombre",lname:"Apellido",name:"Nombre",fullName:"Nombre Completo",email:"E-Mail",country:"Pa\xEDs",type:"Tipo",optional:"Opcional",sexes:{female:"Femenino",male:"Masculino",other:"Otro",unspecified:"No especificado"},users:{permissionsProfile:"Perfil de Permisos",password:"Contrase\xF1a",passwordConfirm:"Confirmar Contrase\xF1a",role:"Permisos",totp_code:"C\xF3digo TOTP",totp_code_opt:"Requerido si se habilit\xF3 en las Preferencias de Cuenta",recovery_code:"C\xF3digo de Respaldo"},phone:"Tel\xE9fono",phoneNumber:"N\xFAmero Telef\xF3nico",secondaryPhone:"Tel\xE9fono Secundario",address:"Direcci\xF3n",addressStreet:"Calle",addressNumber:"Altura",betweenStreets:"Entre Calles",addressVerified:"Direcci\xF3n Verificada",addressCity:"Ciudad",addressPostalCode:"C\xF3digo Postal",addressFloor:"Piso",addressApartment:"Apartamento",addressState:"Estado / Provincia",role:"Rol",featureWIP:"Caracter\xEDstica en desarrollo",notEnoughPerms:"Permisos insuficientes",featureNotAvailable:"Caracter\xEDstica no disponible"},m={copyright:"Derechos de Autor (C) 2022-2024 | BR Consulting S.R.L.",about:"M\xE1s Informaci\xF3n",donate:"Donar"},p={title:"Cuenta",title_long:"Preferencias de la Cuenta",logout:"Cerrar Sesi\xF3n",changePreferences:"Cambiar Preferencias",two_factor_title:"Autenticaci\xF3n de Doble Factor",auto_refresh_token:"Auto-Refrescar Token",enable_two_factor:"Habilitar 2FA TOTP",showQR:"Ver C\xF3digo QR de TOTP",hideQR:"Esconder C\xF3digo QR",validateTOTP:"Validar C\xF3digo QR TOTP",TOTPnotConfirmed:"Por favor confirme su 2FA TOTP",recoveryCodes:"C\xF3digos de Respaldo Consumibles",copyRecoveryCodes:"Copiar C\xF3digos",totpCodeFieldLabel:"C\xF3digo TOTP de 6 d\xEDgitos",totpValidated:"C\xF3digo TOTP Validado",qrIsEnabled:"TOTP 2FA est\xE1 habilitado",qrInfo:"Escanee el C\xF3digo QR con una App de Autenticaci\xF3n TOTP"},_={version:"Versi\xF3n",clickToRefreshBackendStatus:"Haga click para refrescar el estado del Back-end",autocomputedField:"Campo con computado autom\xE1tico",darkMode:"Activar Modo Oscuro",logoutMsg:"\xBFEst\xE1 seguro de cerrar su sesi\xF3n?",loggedOut:"Sesi\xF3n cerrada exitosamente",logoutForbiddenMsg:"Por favor Inicie Sesi\xF3n nuevamente",themerTooltip:"Cambiar Tema",tokenRefreshed:"Token de Acceso Refrescado",actionRequired:"Acci\xF3n Requerida",refreshTokenTimer:"El Token de Refresco expirar\xE1 en"},g={title:"Sobre Interlock",subTitle:"Otros Contribuyentes",mainMsg:'Interlock fue desarrollado originalmente por <a target="_blank" href="https://dylan.blanque.com.ar">Dylan Blanqu\xE9</a> como una herramienta interna para <b>BR Consulting S.R.L.</b> y luego se public\xF3 como producto Open-Source, con la intenci\xF3n de compartir una herramienta din\xE1mica y responsive de administraci\xF3n LDAP con la comunidad.',jblanque:"Acreditado por su asistencia con el Parsing de Permisos Binarios de Samba",mvilche:{1:"Acreditado por el M\xF3dulo de Llamadas y los Constructores del Front-end de Interlock",2:"Acreditado por ayudar con la implementaci\xF3n del Notification Bus",3:"Otros cambios y arreglos menores"},etianen:"Acreditado por crear el m\xF3dulo original de Django-python3-ldap",dirkjanm:"Acreditado por su <b>incre\xEDble</b> repo krbrelayx y sus scripts"},D={incomplete:{en:"Translation not complete yet",es:"Traducci\xF3n a\xFAn no completada",fr:"Traduction pas encore termin\xE9e"}};var b={indexTitle:e,category:o,actions:r,words:a,classes:i,error:s,dns:n,ldap:t,components:d,nav:l,section:c,attribute:u,footer:m,userAccountDropdown:p,misc:_,contrib:g,locale:D};export{r as actions,u as attribute,o as category,i as classes,d as components,g as contrib,b as default,n as dns,s as error,m as footer,e as indexTitle,t as ldap,D as locale,_ as misc,l as nav,c as section,p as userAccountDropdown,a as words};