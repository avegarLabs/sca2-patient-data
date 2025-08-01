// @generated automatically by Diesel CLI.

diesel::table! {
    datos_generales (id) {
        id -> Nullable<Integer>,
        codigo -> Text,
        nombres_apellidos -> Nullable<Text>,
        historia_clinica -> Nullable<Text>,
        area_salud -> Nullable<Text>,
        fecha_encuesta -> Nullable<Text>,
        fecha_nacimiento -> Nullable<Text>,
        sexo -> Nullable<Text>,
        raza -> Nullable<Text>,
        edad_actual -> Nullable<Integer>,
        generacion -> Nullable<Text>,
        estado_civil_ae -> Nullable<Text>,
        estado_civil_de -> Nullable<Text>,
        num_hijos -> Nullable<Integer>,
        hijos_sanos -> Nullable<Integer>,
        hijos_enfermos -> Nullable<Integer>,
        num_hermanos -> Nullable<Integer>,
        hermanos_sanos -> Nullable<Integer>,
        hermanos_enfermos -> Nullable<Integer>,
        anos_vida_sano -> Nullable<Integer>,
        nivel_educacional -> Nullable<Text>,
        profesion -> Nullable<Text>,
        estado_laboral_ae -> Nullable<Text>,
        estado_laboral_ad -> Nullable<Text>,
        salario_mensual -> Nullable<Float>,
        num_convivientes -> Nullable<Integer>,
        tiene_app -> Nullable<Text>,
        especificar_app -> Nullable<Text>,
        familiar_otra_provincia -> Nullable<Text>,
        especificar_familiar_provincia -> Nullable<Text>,
        familiar_extranjero -> Nullable<Text>,
        especificar_familiar_extranjero -> Nullable<Text>,
        direccion_calle -> Nullable<Text>,
        direccion_entre -> Nullable<Text>,
        direccion_numero -> Nullable<Integer>,
        direccion_apartamento -> Nullable<Text>,
        direccion_reparto -> Nullable<Text>,
        direccion_localidad -> Nullable<Text>,
        cp -> Nullable<Integer>,
        municipio -> Nullable<Text>,
        provincia -> Nullable<Text>,
        telefono -> Nullable<Text>,
        grado_afectacion_marcha -> Nullable<Integer>,
        evolucion_sintomas -> Nullable<Text>,
        etapa_clinica -> Nullable<Text>,
        tipo_herencia -> Nullable<Text>,
        edad_inicio_sintomas -> Nullable<Integer>,
        tiempo_evolucion -> Nullable<Integer>,
        estudio_molecular -> Nullable<Text>,
        descendientes_riesgo_50 -> Nullable<Integer>,
        descendientes_riesgo_25 -> Nullable<Integer>,
        diagnostico_prenatal -> Nullable<Integer>,
        diagnostico_presintomatico -> Nullable<Integer>,
        presuntivos_prenatal -> Nullable<Integer>,
        presuntivos_presintomatico -> Nullable<Integer>,
        romberg_simple -> Nullable<Float>,
        romberg_sensibilizado -> Nullable<Float>,
        indice_nariz -> Nullable<Float>,
        direccion_completa -> Nullable<Text>,
        consejo -> Nullable<Text>,
    }
}

diesel::table! {
    paciente_sca (paciente_id, sca_id) {
        paciente_id -> Integer,
        sca_id -> Integer,
        especificar -> Nullable<Text>,
    }
}

diesel::table! {
    paciente_sintoma (id) {
        id -> Nullable<Integer>,
        paciente_id -> Integer,
        sintoma_id -> Integer,
        fase -> Integer,
        es_inicial -> Nullable<Bool>,
        es_predominante -> Nullable<Bool>,
        es_otro -> Nullable<Bool>,
        especificar -> Nullable<Text>,
    }
}

diesel::table! {
    sca (id) {
        id -> Nullable<Integer>,
        nombre -> Text,
    }
}

diesel::table! {
    sintomas (id) {
        id -> Nullable<Integer>,
        nombre -> Text,
    }
}

diesel::joinable!(paciente_sca -> datos_generales (paciente_id));
diesel::joinable!(paciente_sca -> sca (sca_id));
diesel::joinable!(paciente_sintoma -> datos_generales (paciente_id));
diesel::joinable!(paciente_sintoma -> sintomas (sintoma_id));

diesel::allow_tables_to_appear_in_same_query!(
    datos_generales,
    paciente_sca,
    paciente_sintoma,
    sca,
    sintomas,
);
