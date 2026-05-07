import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const bucketName = "cv-uploads";

if (!supabaseUrl || !supabaseSecretKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const ensureBucket = async () => {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw new Error(`Failed to list buckets: ${listError.message}`);
  }

  const existing = buckets?.find((bucket) => bucket.name === bucketName);
  if (existing) {
    console.log(`Bucket already exists: ${bucketName}`);
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: "10MB",
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  });

  if (createError) {
    throw new Error(`Failed to create bucket: ${createError.message}`);
  }

  console.log(`Created bucket: ${bucketName}`);
};

const showSqlInstructions = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const sqlPath = path.join(__dirname, "supabase-schema.sql");
  const sql = await readFile(sqlPath, "utf8");

  console.log("\nRun this SQL in Supabase SQL Editor:\n");
  console.log(sql);
};

(async () => {
  try {
    await ensureBucket();
    await showSqlInstructions();
    console.log("\nSupabase setup check completed.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
})();
