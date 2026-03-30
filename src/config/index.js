import 'dotenv/config'
export const config = {
  port:        process.env.PORT || 3001,
  clientUrl:   process.env.CLIENT_URL,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_KEY,
}