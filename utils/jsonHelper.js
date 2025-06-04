const construirJsonRegistro = (registro) => {
    //Se convertira el objeto de registro a JSON para poder guardarlo en la bitacora
    
    return JSON.stringify(registro);
}

export default construirJsonRegistro;