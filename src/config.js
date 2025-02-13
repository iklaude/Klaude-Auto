import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, 'Discord token is required'),
  UPVOTE_EMOJI: z.string().min(1, 'Upvote emoji ID is required'),
});

const parseEnvVars = () => {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    const formatted = result.error.format();
    console.error('Environment variable validation failed:', formatted);
    process.exit(1);
  }
  
  return result.data;
};

export const config = parseEnvVars();
