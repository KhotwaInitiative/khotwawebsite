/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const CV_BUCKET = "cv-uploads";

const sanitizeFileName = (name: string) =>
  name
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Step 1: Personal Information
    const name_ar = formData.get("name_ar")?.toString() || "";
    const name_en = formData.get("name_en")?.toString() || "";
    const birthdate = formData.get("birthdate")?.toString() || "";
    const gender = formData.get("gender")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone_number = formData.get("phone_number")?.toString() || "";

    // Step 2: Academic Information
    const university = formData.get("university")?.toString() || "";
    const major = formData.get("major")?.toString() || "";
    const uni_id = formData.get("uni_id")?.toString() || "";
    const graduation_year = formData.get("graduation_year")?.toString() || "";
    const linkedin = formData.get("linkedin")?.toString() || "";

    // Step 3: Concerns & Preferences
    const interests = formData.get("interests")?.toString() || "";
    const skills_projects = formData.get("skills_projects")?.toString() || "";
    const experience_volunteer = formData.get("experience_volunteer")?.toString() || "";
    const free_space = formData.get("free_space")?.toString() || "";

    // Step 4: Company & Job Ordering
    const companies_order = formData.get("companies_order")?.toString() || "";
    const job_titles_order = formData.get("job_titles_order")?.toString() || "";

    // CV File
    const cvFile = formData.get("cv_file") as File | null;

    // Validate required fields
    if (
      !name_ar || !name_en || !birthdate || !gender || !email || !phone_number ||
      !university || !major || !uni_id || !graduation_year || !linkedin ||
      !interests || !skills_projects || !experience_volunteer ||
      !companies_order || !job_titles_order || !cvFile
    ) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Upload CV file
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    const safeFileName = sanitizeFileName(cvFile.name);
    const filePath = `${uni_id}/${Date.now()}_${safeFileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(CV_BUCKET)
      .upload(filePath, buffer, {
        contentType: cvFile.type || "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload CV: ${uploadError.message}`);
    }

    const { data: publicData } = supabaseAdmin.storage.from(CV_BUCKET).getPublicUrl(filePath);
    const cv_url = publicData.publicUrl;

    // Insert into database
    const { data: insertedRow, error: insertError } = await supabaseAdmin
      .from("registrations")
      .insert({
        name_ar,
        name_en,
        birthdate,
        gender,
        email,
        phone_number,
        university,
        major,
        uni_id,
        graduation_year,
        linkedin,
        interests,
        skills_projects,
        experience_volunteer,
        free_space,
        cv_path: filePath,
        cv_url,
        companies_order,
        job_titles_order,
      })
      .select("id, created_at")
      .single();

    if (insertError) {
      await supabaseAdmin.storage.from(CV_BUCKET).remove([filePath]);
      throw new Error(`Failed to save registration: ${insertError.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        registration: {
          id: insertedRow.id,
          created_at: insertedRow.created_at,
          cv_path: filePath,
          cv_url,
        },
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Registration Server Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
