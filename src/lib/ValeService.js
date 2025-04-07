import supabase from "./supabase";

export const fetchVales = async () => {
    const { data, error } = await supabase
    .from('vales')
    .select(`
      id,
      vale_url,
      signature_id,
      created_at,
       user_id,
      profiles:profiles!user_id (username)  // Relación con la tabla profiles
    `);

    if (error) {
      console.error('Error fetching vales:', error);
      throw error;
    }
    // console.log(data);
    return data;
}

export const fetchSignature = async (id) => {
    const { data, error } = await supabase
      .from('signatures')
      .select(`
        id,
        user_id,
        signature_url
      `)
      .eq('id', id)
       // Obtiene un solo registro
  
    if (error) {
      console.error('Error fetching signature:', error);
      throw error;
    }
  
    return data;
  }

