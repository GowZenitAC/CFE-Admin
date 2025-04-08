import supabase from "./supabase";



export const fetchReports = async () => {
    const { data, error } = await supabase
      .from('inspections')
      .select(`
        id,
        fecha,
        placas_vehiculo,
        hora_inicio,
        hora_finalizacion,
        user_id,
        profiles:profiles!user_id (username)  // Relación con la tabla profiles
      `);
  
    if (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  
    return data;
  };

  export const fetchDetailInspection = async (id) => {
    console.log(typeof id);
    const { data, error } = await supabase
      .from('inspections')
      .select(`
        id,
        user_id,
        user_signature_id,
        fecha,
        placas_vehiculo,
        viseras,
        espejo_interior,
        espejo_lateral,
        cristales_puerta,
        parabrisas,
        elevadores_cristales,
        cerraduras,
        cinturon_seguridad,
        volante,
        luces_delanteras,
        limpieza_vehiculo,
        cuartos,
        luces_frenos,
        luces_direccionales,
        luces_intermitentes,
        freno_pie,
        freno_mano,
        nivel_aceite_motor,
        nivel_aceite_trans,
        liquido_frenos,
        llantas,
        litros_gasolina_gastada,
        botiquin,
        extintor,
        gato_hidraulico,
        cruceta,
        lampara_mano,
        cables_pasacorriente,
        llanta_refaccion,
        luces_reflejantes,
        hora_inicio,
        hora_finalizacion,
        observaciones,
        kilometraje_inicio,
        kilometraje_final,
        profiles:profiles!user_id (username)
      `)
      .eq('id', id)
      .single(); // Obtiene un solo registro
  
    if (error) {
      console.error('Error fetching inspection details:', error);
      throw error;
    }
  
    return data;
  };

  export const fetchSignature = async (id) => {
    const { data, error } = await supabase
      .from('signatures')
      .select(`
        id,
        user_id,
        signature_url
      `)
      .eq('id', id)
      .single(); // Obtiene un solo registro
  
    if (error) {
      console.error('Error fetching signature:', error);
      throw error;
    }
  
    return data;
  }