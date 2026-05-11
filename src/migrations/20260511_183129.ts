import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_link_appearance" AS ENUM('default', 'outline', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_archive_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_vacancies_block_view_all_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_link_appearance" AS ENUM('default', 'outline', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_vacancies_block_view_all_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('super-admin', 'user');
  CREATE TYPE "public"."enum_users_tenants_roles" AS ENUM('tenant-admin', 'tenant-viewer');
  CREATE TYPE "public"."enum_vacancies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__vacancies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_footer_menu_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_social_items_platform" AS ENUM('instagram', 'tiktok', 'facebook', 'linkedin', 'twitter', 'youtube');
  CREATE TYPE "public"."enum_footer_social_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_legal_items_link_type" AS ENUM('reference', 'custom');
  ALTER TYPE "public"."enum_pages_hero_links_link_appearance" ADD VALUE 'secondary';
  ALTER TYPE "public"."enum_pages_blocks_content_columns_link_appearance" ADD VALUE 'secondary';
  ALTER TYPE "public"."enum__pages_v_version_hero_links_link_appearance" ADD VALUE 'secondary';
  ALTER TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" ADD VALUE 'secondary';
  CREATE TABLE "pages_hero_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_hero_social_proof_avatars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"avatar_id" integer
  );
  
  CREATE TABLE "pages_blocks_vacancies_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"limit" numeric DEFAULT 3,
  	"view_all_link_type" "enum_pages_blocks_vacancies_block_view_all_link_type" DEFAULT 'reference',
  	"view_all_link_new_tab" boolean,
  	"view_all_link_open_in_popup" boolean,
  	"view_all_link_url" varchar,
  	"view_all_link_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_usp_block_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_usp_block_columns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_usp_block_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "pages_blocks_usp_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_social_proof_avatars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_vacancies_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"limit" numeric DEFAULT 3,
  	"view_all_link_type" "enum__pages_v_blocks_vacancies_block_view_all_link_type" DEFAULT 'reference',
  	"view_all_link_new_tab" boolean,
  	"view_all_link_open_in_popup" boolean,
  	"view_all_link_url" varchar,
  	"view_all_link_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_usp_block_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_usp_block_columns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_usp_block_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_usp_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_tenants_roles" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_users_tenants_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_tenants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"domain" varchar,
  	"slug" varchar NOT NULL,
  	"logo_id" integer,
  	"primary_color" varchar,
  	"contact_info_email" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_address" varchar,
  	"contact_info_kvk" varchar,
  	"contact_info_btw" varchar,
  	"allow_public_read" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vacancies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar,
  	"vacancy_type" varchar,
  	"excerpt" varchar,
  	"description" jsonb,
  	"apply_url" varchar,
  	"apply_email" varchar,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_vacancies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_vacancies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_title" varchar,
  	"version_vacancy_type" varchar,
  	"version_excerpt" varchar,
  	"version_description" jsonb,
  	"version_apply_url" varchar,
  	"version_apply_email" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__vacancies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "footer_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_menu_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_open_in_popup" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_social_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_items_platform" NOT NULL,
  	"link_type" "enum_footer_social_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_open_in_popup" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_legal_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_open_in_popup" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  ALTER TABLE "pages_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_nav_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_cta_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links" CASCADE;
  DROP TABLE "footer_nav_items" CASCADE;
  DROP INDEX "redirects_from_idx";
  ALTER TABLE "forms_emails" ALTER COLUMN "subject" SET DEFAULT 'You''ve received a new message.';
  ALTER TABLE "header" ALTER COLUMN "updated_at" SET DEFAULT now();
  ALTER TABLE "header" ALTER COLUMN "updated_at" SET NOT NULL;
  ALTER TABLE "header" ALTER COLUMN "created_at" SET DEFAULT now();
  ALTER TABLE "header" ALTER COLUMN "created_at" SET NOT NULL;
  ALTER TABLE "footer" ALTER COLUMN "updated_at" SET DEFAULT now();
  ALTER TABLE "footer" ALTER COLUMN "updated_at" SET NOT NULL;
  ALTER TABLE "footer" ALTER COLUMN "created_at" SET DEFAULT now();
  ALTER TABLE "footer" ALTER COLUMN "created_at" SET NOT NULL;
  ALTER TABLE "pages_hero_links" ADD COLUMN "link_open_in_popup" boolean;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "image_id" integer;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "text" varchar;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "link_type" "enum_pages_blocks_cta_link_type" DEFAULT 'reference';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "link_open_in_popup" boolean;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "link_appearance" "enum_pages_blocks_cta_link_appearance" DEFAULT 'default';
  ALTER TABLE "pages_blocks_content_columns" ADD COLUMN "link_open_in_popup" boolean;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "link_type" "enum_pages_blocks_archive_link_type" DEFAULT 'reference';
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "link_open_in_popup" boolean;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "tenant_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_eyebrow" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_intro_text" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_social_proof_text" varchar;
  ALTER TABLE "_pages_v_version_hero_links" ADD COLUMN "link_open_in_popup" boolean;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "image_id" integer;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "text" varchar;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "link_type" "enum__pages_v_blocks_cta_link_type" DEFAULT 'reference';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "link_open_in_popup" boolean;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "link_url" varchar;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "link_appearance" "enum__pages_v_blocks_cta_link_appearance" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_content_columns" ADD COLUMN "link_open_in_popup" boolean;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "link_type" "enum__pages_v_blocks_archive_link_type" DEFAULT 'reference';
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "link_open_in_popup" boolean;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "link_url" varchar;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_tenant_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_eyebrow" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_heading" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_intro_text" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_social_proof_text" varchar;
  ALTER TABLE "posts" ADD COLUMN "tenant_id" integer;
  ALTER TABLE "posts" ADD COLUMN "read_time" numeric;
  ALTER TABLE "_posts_v" ADD COLUMN "version_tenant_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_read_time" numeric;
  ALTER TABLE "media" ADD COLUMN "tenant_id" integer;
  ALTER TABLE "redirects" ADD COLUMN "tenant_id" integer;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "forms" ADD COLUMN "tenant_id" integer;
  ALTER TABLE "form_submissions" ADD COLUMN "tenant_id" integer;
  ALTER TABLE "search" ADD COLUMN "tenant_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tenants_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "vacancies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "header_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "footer_id" integer;
  ALTER TABLE "header_nav_items" ADD COLUMN "link_open_in_popup" boolean;
  ALTER TABLE "header" ADD COLUMN "tenant_id" integer;
  ALTER TABLE "footer" ADD COLUMN "tenant_id" integer;
  ALTER TABLE "footer" ADD COLUMN "copyright" varchar;
  ALTER TABLE "pages_hero_images" ADD CONSTRAINT "pages_hero_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_hero_images" ADD CONSTRAINT "pages_hero_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_social_proof_avatars" ADD CONSTRAINT "pages_hero_social_proof_avatars_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_hero_social_proof_avatars" ADD CONSTRAINT "pages_hero_social_proof_avatars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_vacancies_block" ADD CONSTRAINT "pages_blocks_vacancies_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_usp_block_gallery" ADD CONSTRAINT "pages_blocks_usp_block_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_usp_block_gallery" ADD CONSTRAINT "pages_blocks_usp_block_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_usp_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_usp_block_columns_items" ADD CONSTRAINT "pages_blocks_usp_block_columns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_usp_block_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_usp_block_columns" ADD CONSTRAINT "pages_blocks_usp_block_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_usp_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_usp_block" ADD CONSTRAINT "pages_blocks_usp_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_images" ADD CONSTRAINT "_pages_v_version_hero_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_images" ADD CONSTRAINT "_pages_v_version_hero_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_social_proof_avatars" ADD CONSTRAINT "_pages_v_version_hero_social_proof_avatars_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_social_proof_avatars" ADD CONSTRAINT "_pages_v_version_hero_social_proof_avatars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_vacancies_block" ADD CONSTRAINT "_pages_v_blocks_vacancies_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_usp_block_gallery" ADD CONSTRAINT "_pages_v_blocks_usp_block_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_usp_block_gallery" ADD CONSTRAINT "_pages_v_blocks_usp_block_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_usp_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_usp_block_columns_items" ADD CONSTRAINT "_pages_v_blocks_usp_block_columns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_usp_block_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_usp_block_columns" ADD CONSTRAINT "_pages_v_blocks_usp_block_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_usp_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_usp_block" ADD CONSTRAINT "_pages_v_blocks_usp_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_tenants_roles" ADD CONSTRAINT "users_tenants_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users_tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenants" ADD CONSTRAINT "tenants_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vacancies" ADD CONSTRAINT "vacancies_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vacancies_v" ADD CONSTRAINT "_vacancies_v_parent_id_vacancies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vacancies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vacancies_v" ADD CONSTRAINT "_vacancies_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_menu_items" ADD CONSTRAINT "footer_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_items" ADD CONSTRAINT "footer_social_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_items" ADD CONSTRAINT "footer_legal_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_images_order_idx" ON "pages_hero_images" USING btree ("_order");
  CREATE INDEX "pages_hero_images_parent_id_idx" ON "pages_hero_images" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_images_image_idx" ON "pages_hero_images" USING btree ("image_id");
  CREATE INDEX "pages_hero_social_proof_avatars_order_idx" ON "pages_hero_social_proof_avatars" USING btree ("_order");
  CREATE INDEX "pages_hero_social_proof_avatars_parent_id_idx" ON "pages_hero_social_proof_avatars" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_social_proof_avatars_avatar_idx" ON "pages_hero_social_proof_avatars" USING btree ("avatar_id");
  CREATE INDEX "pages_blocks_vacancies_block_order_idx" ON "pages_blocks_vacancies_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_vacancies_block_parent_id_idx" ON "pages_blocks_vacancies_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_vacancies_block_path_idx" ON "pages_blocks_vacancies_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_usp_block_gallery_order_idx" ON "pages_blocks_usp_block_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_usp_block_gallery_parent_id_idx" ON "pages_blocks_usp_block_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_usp_block_gallery_image_idx" ON "pages_blocks_usp_block_gallery" USING btree ("image_id");
  CREATE INDEX "pages_blocks_usp_block_columns_items_order_idx" ON "pages_blocks_usp_block_columns_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_usp_block_columns_items_parent_id_idx" ON "pages_blocks_usp_block_columns_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_usp_block_columns_order_idx" ON "pages_blocks_usp_block_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_usp_block_columns_parent_id_idx" ON "pages_blocks_usp_block_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_usp_block_order_idx" ON "pages_blocks_usp_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_usp_block_parent_id_idx" ON "pages_blocks_usp_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_usp_block_path_idx" ON "pages_blocks_usp_block" USING btree ("_path");
  CREATE INDEX "_pages_v_version_hero_images_order_idx" ON "_pages_v_version_hero_images" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_images_parent_id_idx" ON "_pages_v_version_hero_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_images_image_idx" ON "_pages_v_version_hero_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_version_hero_social_proof_avatars_order_idx" ON "_pages_v_version_hero_social_proof_avatars" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_social_proof_avatars_parent_id_idx" ON "_pages_v_version_hero_social_proof_avatars" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_social_proof_avatars_avatar_idx" ON "_pages_v_version_hero_social_proof_avatars" USING btree ("avatar_id");
  CREATE INDEX "_pages_v_blocks_vacancies_block_order_idx" ON "_pages_v_blocks_vacancies_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_vacancies_block_parent_id_idx" ON "_pages_v_blocks_vacancies_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_vacancies_block_path_idx" ON "_pages_v_blocks_vacancies_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_usp_block_gallery_order_idx" ON "_pages_v_blocks_usp_block_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_usp_block_gallery_parent_id_idx" ON "_pages_v_blocks_usp_block_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_usp_block_gallery_image_idx" ON "_pages_v_blocks_usp_block_gallery" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_usp_block_columns_items_order_idx" ON "_pages_v_blocks_usp_block_columns_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_usp_block_columns_items_parent_id_idx" ON "_pages_v_blocks_usp_block_columns_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_usp_block_columns_order_idx" ON "_pages_v_blocks_usp_block_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_usp_block_columns_parent_id_idx" ON "_pages_v_blocks_usp_block_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_usp_block_order_idx" ON "_pages_v_blocks_usp_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_usp_block_parent_id_idx" ON "_pages_v_blocks_usp_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_usp_block_path_idx" ON "_pages_v_blocks_usp_block" USING btree ("_path");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_tenants_roles_order_idx" ON "users_tenants_roles" USING btree ("order");
  CREATE INDEX "users_tenants_roles_parent_idx" ON "users_tenants_roles" USING btree ("parent_id");
  CREATE INDEX "users_tenants_order_idx" ON "users_tenants" USING btree ("_order");
  CREATE INDEX "users_tenants_parent_id_idx" ON "users_tenants" USING btree ("_parent_id");
  CREATE INDEX "users_tenants_tenant_idx" ON "users_tenants" USING btree ("tenant_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "tenants_domain_idx" ON "tenants" USING btree ("domain");
  CREATE INDEX "tenants_slug_idx" ON "tenants" USING btree ("slug");
  CREATE INDEX "tenants_logo_idx" ON "tenants" USING btree ("logo_id");
  CREATE INDEX "tenants_allow_public_read_idx" ON "tenants" USING btree ("allow_public_read");
  CREATE INDEX "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE INDEX "vacancies_tenant_idx" ON "vacancies" USING btree ("tenant_id");
  CREATE INDEX "vacancies_slug_idx" ON "vacancies" USING btree ("slug");
  CREATE INDEX "vacancies_updated_at_idx" ON "vacancies" USING btree ("updated_at");
  CREATE INDEX "vacancies_created_at_idx" ON "vacancies" USING btree ("created_at");
  CREATE INDEX "vacancies__status_idx" ON "vacancies" USING btree ("_status");
  CREATE INDEX "_vacancies_v_parent_idx" ON "_vacancies_v" USING btree ("parent_id");
  CREATE INDEX "_vacancies_v_version_version_tenant_idx" ON "_vacancies_v" USING btree ("version_tenant_id");
  CREATE INDEX "_vacancies_v_version_version_slug_idx" ON "_vacancies_v" USING btree ("version_slug");
  CREATE INDEX "_vacancies_v_version_version_updated_at_idx" ON "_vacancies_v" USING btree ("version_updated_at");
  CREATE INDEX "_vacancies_v_version_version_created_at_idx" ON "_vacancies_v" USING btree ("version_created_at");
  CREATE INDEX "_vacancies_v_version_version__status_idx" ON "_vacancies_v" USING btree ("version__status");
  CREATE INDEX "_vacancies_v_created_at_idx" ON "_vacancies_v" USING btree ("created_at");
  CREATE INDEX "_vacancies_v_updated_at_idx" ON "_vacancies_v" USING btree ("updated_at");
  CREATE INDEX "_vacancies_v_latest_idx" ON "_vacancies_v" USING btree ("latest");
  CREATE INDEX "_vacancies_v_autosave_idx" ON "_vacancies_v" USING btree ("autosave");
  CREATE INDEX "footer_menu_items_order_idx" ON "footer_menu_items" USING btree ("_order");
  CREATE INDEX "footer_menu_items_parent_id_idx" ON "footer_menu_items" USING btree ("_parent_id");
  CREATE INDEX "footer_social_items_order_idx" ON "footer_social_items" USING btree ("_order");
  CREATE INDEX "footer_social_items_parent_id_idx" ON "footer_social_items" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_items_order_idx" ON "footer_legal_items" USING btree ("_order");
  CREATE INDEX "footer_legal_items_parent_id_idx" ON "footer_legal_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects" ADD CONSTRAINT "redirects_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms" ADD CONSTRAINT "forms_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vacancies_fk" FOREIGN KEY ("vacancies_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_header_fk" FOREIGN KEY ("header_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_footer_fk" FOREIGN KEY ("footer_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_cta_image_idx" ON "pages_blocks_cta" USING btree ("image_id");
  CREATE INDEX "pages_tenant_idx" ON "pages" USING btree ("tenant_id");
  CREATE INDEX "_pages_v_blocks_cta_image_idx" ON "_pages_v_blocks_cta" USING btree ("image_id");
  CREATE INDEX "_pages_v_version_version_tenant_idx" ON "_pages_v" USING btree ("version_tenant_id");
  CREATE INDEX "posts_tenant_idx" ON "posts" USING btree ("tenant_id");
  CREATE INDEX "_posts_v_version_version_tenant_idx" ON "_posts_v" USING btree ("version_tenant_id");
  CREATE INDEX "media_tenant_idx" ON "media" USING btree ("tenant_id");
  CREATE INDEX "redirects_tenant_idx" ON "redirects" USING btree ("tenant_id");
  CREATE INDEX "forms_tenant_idx" ON "forms" USING btree ("tenant_id");
  CREATE INDEX "form_submissions_tenant_idx" ON "form_submissions" USING btree ("tenant_id");
  CREATE INDEX "search_tenant_idx" ON "search" USING btree ("tenant_id");
  CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX "payload_locked_documents_rels_vacancies_id_idx" ON "payload_locked_documents_rels" USING btree ("vacancies_id");
  CREATE INDEX "payload_locked_documents_rels_header_id_idx" ON "payload_locked_documents_rels" USING btree ("header_id");
  CREATE INDEX "payload_locked_documents_rels_footer_id_idx" ON "payload_locked_documents_rels" USING btree ("footer_id");
  CREATE UNIQUE INDEX "header_tenant_idx" ON "header" USING btree ("tenant_id");
  CREATE INDEX "header_updated_at_idx" ON "header" USING btree ("updated_at");
  CREATE INDEX "header_created_at_idx" ON "header" USING btree ("created_at");
  CREATE UNIQUE INDEX "footer_tenant_idx" ON "footer" USING btree ("tenant_id");
  CREATE INDEX "footer_updated_at_idx" ON "footer" USING btree ("updated_at");
  CREATE INDEX "footer_created_at_idx" ON "footer" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "rich_text";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "rich_text";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_footer_nav_items_link_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "pages_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  ALTER TABLE "pages_hero_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_hero_social_proof_avatars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_vacancies_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_usp_block_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_usp_block_columns_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_usp_block_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_usp_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_hero_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_hero_social_proof_avatars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_vacancies_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_usp_block_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_usp_block_columns_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_usp_block_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_usp_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "users_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "users_tenants_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "users_tenants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "users_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vacancies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_vacancies_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_menu_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_social_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_legal_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_kv" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_hero_images" CASCADE;
  DROP TABLE "pages_hero_social_proof_avatars" CASCADE;
  DROP TABLE "pages_blocks_vacancies_block" CASCADE;
  DROP TABLE "pages_blocks_usp_block_gallery" CASCADE;
  DROP TABLE "pages_blocks_usp_block_columns_items" CASCADE;
  DROP TABLE "pages_blocks_usp_block_columns" CASCADE;
  DROP TABLE "pages_blocks_usp_block" CASCADE;
  DROP TABLE "_pages_v_version_hero_images" CASCADE;
  DROP TABLE "_pages_v_version_hero_social_proof_avatars" CASCADE;
  DROP TABLE "_pages_v_blocks_vacancies_block" CASCADE;
  DROP TABLE "_pages_v_blocks_usp_block_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_usp_block_columns_items" CASCADE;
  DROP TABLE "_pages_v_blocks_usp_block_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_usp_block" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_tenants_roles" CASCADE;
  DROP TABLE "users_tenants" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "tenants" CASCADE;
  DROP TABLE "vacancies" CASCADE;
  DROP TABLE "_vacancies_v" CASCADE;
  DROP TABLE "footer_menu_items" CASCADE;
  DROP TABLE "footer_social_items" CASCADE;
  DROP TABLE "footer_legal_items" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  ALTER TABLE "pages_blocks_cta" DROP CONSTRAINT "pages_blocks_cta_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_tenant_id_tenants_id_fk";
  
  ALTER TABLE "_pages_v_blocks_cta" DROP CONSTRAINT "_pages_v_blocks_cta_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_tenant_id_tenants_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_tenant_id_tenants_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_tenant_id_tenants_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT "media_tenant_id_tenants_id_fk";
  
  ALTER TABLE "header" DROP CONSTRAINT "header_tenant_id_tenants_id_fk";
  
  ALTER TABLE "footer" DROP CONSTRAINT "footer_tenant_id_tenants_id_fk";
  
  ALTER TABLE "redirects" DROP CONSTRAINT "redirects_tenant_id_tenants_id_fk";
  
  ALTER TABLE "forms" DROP CONSTRAINT "forms_tenant_id_tenants_id_fk";
  
  ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_tenant_id_tenants_id_fk";
  
  ALTER TABLE "search" DROP CONSTRAINT "search_tenant_id_tenants_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tenants_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_vacancies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_header_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_footer_fk";
  
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_pages_hero_links_link_appearance";
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_pages_hero_links_link_appearance" USING "link_appearance"::"public"."enum_pages_hero_links_link_appearance";
  ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_appearance";
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_pages_blocks_content_columns_link_appearance";
  ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_pages_blocks_content_columns_link_appearance" USING "link_appearance"::"public"."enum_pages_blocks_content_columns_link_appearance";
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum__pages_v_version_hero_links_link_appearance";
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum__pages_v_version_hero_links_link_appearance" USING "link_appearance"::"public"."enum__pages_v_version_hero_links_link_appearance";
  ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance";
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum__pages_v_blocks_content_columns_link_appearance";
  ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" USING "link_appearance"::"public"."enum__pages_v_blocks_content_columns_link_appearance";
  DROP INDEX "pages_blocks_cta_image_idx";
  DROP INDEX "pages_tenant_idx";
  DROP INDEX "_pages_v_blocks_cta_image_idx";
  DROP INDEX "_pages_v_version_version_tenant_idx";
  DROP INDEX "posts_tenant_idx";
  DROP INDEX "_posts_v_version_version_tenant_idx";
  DROP INDEX "media_tenant_idx";
  DROP INDEX "header_tenant_idx";
  DROP INDEX "header_updated_at_idx";
  DROP INDEX "header_created_at_idx";
  DROP INDEX "footer_tenant_idx";
  DROP INDEX "footer_updated_at_idx";
  DROP INDEX "footer_created_at_idx";
  DROP INDEX "redirects_tenant_idx";
  DROP INDEX "forms_tenant_idx";
  DROP INDEX "form_submissions_tenant_idx";
  DROP INDEX "search_tenant_idx";
  DROP INDEX "payload_locked_documents_rels_tenants_id_idx";
  DROP INDEX "payload_locked_documents_rels_vacancies_id_idx";
  DROP INDEX "payload_locked_documents_rels_header_id_idx";
  DROP INDEX "payload_locked_documents_rels_footer_id_idx";
  DROP INDEX "redirects_from_idx";
  ALTER TABLE "header" ALTER COLUMN "updated_at" DROP DEFAULT;
  ALTER TABLE "header" ALTER COLUMN "updated_at" DROP NOT NULL;
  ALTER TABLE "header" ALTER COLUMN "created_at" DROP DEFAULT;
  ALTER TABLE "header" ALTER COLUMN "created_at" DROP NOT NULL;
  ALTER TABLE "footer" ALTER COLUMN "updated_at" DROP DEFAULT;
  ALTER TABLE "footer" ALTER COLUMN "updated_at" DROP NOT NULL;
  ALTER TABLE "footer" ALTER COLUMN "created_at" DROP DEFAULT;
  ALTER TABLE "footer" ALTER COLUMN "created_at" DROP NOT NULL;
  ALTER TABLE "forms_emails" ALTER COLUMN "subject" SET DEFAULT 'You''''ve received a new message.';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "rich_text" jsonb;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "rich_text" jsonb;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_cta_links_order_idx" ON "pages_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_links_parent_id_idx" ON "pages_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_links_order_idx" ON "_pages_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_links_parent_id_idx" ON "_pages_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  CREATE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  ALTER TABLE "pages_hero_links" DROP COLUMN "link_open_in_popup";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "image_id";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "text";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "link_type";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "link_open_in_popup";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "link_url";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "link_appearance";
  ALTER TABLE "pages_blocks_content_columns" DROP COLUMN "link_open_in_popup";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "link_type";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "link_open_in_popup";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "link_url";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "link_label";
  ALTER TABLE "pages" DROP COLUMN "tenant_id";
  ALTER TABLE "pages" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "pages" DROP COLUMN "hero_heading";
  ALTER TABLE "pages" DROP COLUMN "hero_intro_text";
  ALTER TABLE "pages" DROP COLUMN "hero_social_proof_text";
  ALTER TABLE "_pages_v_version_hero_links" DROP COLUMN "link_open_in_popup";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "image_id";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "text";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "link_type";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "link_open_in_popup";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "link_url";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "link_appearance";
  ALTER TABLE "_pages_v_blocks_content_columns" DROP COLUMN "link_open_in_popup";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "link_type";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "link_open_in_popup";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "link_url";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v" DROP COLUMN "version_tenant_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_eyebrow";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_heading";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_intro_text";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_social_proof_text";
  ALTER TABLE "posts" DROP COLUMN "tenant_id";
  ALTER TABLE "posts" DROP COLUMN "read_time";
  ALTER TABLE "_posts_v" DROP COLUMN "version_tenant_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_read_time";
  ALTER TABLE "media" DROP COLUMN "tenant_id";
  ALTER TABLE "header_nav_items" DROP COLUMN "link_open_in_popup";
  ALTER TABLE "header" DROP COLUMN "tenant_id";
  ALTER TABLE "footer" DROP COLUMN "tenant_id";
  ALTER TABLE "footer" DROP COLUMN "copyright";
  ALTER TABLE "redirects" DROP COLUMN "tenant_id";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "placeholder";
  ALTER TABLE "forms" DROP COLUMN "tenant_id";
  ALTER TABLE "form_submissions" DROP COLUMN "tenant_id";
  ALTER TABLE "search" DROP COLUMN "tenant_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tenants_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "vacancies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "header_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "footer_id";
  DROP TYPE "public"."enum_pages_blocks_cta_link_type";
  DROP TYPE "public"."enum_pages_blocks_cta_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_archive_link_type";
  DROP TYPE "public"."enum_pages_blocks_vacancies_block_view_all_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_archive_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_vacancies_block_view_all_link_type";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_users_tenants_roles";
  DROP TYPE "public"."enum_vacancies_status";
  DROP TYPE "public"."enum__vacancies_v_version_status";
  DROP TYPE "public"."enum_footer_menu_items_link_type";
  DROP TYPE "public"."enum_footer_social_items_platform";
  DROP TYPE "public"."enum_footer_social_items_link_type";
  DROP TYPE "public"."enum_footer_legal_items_link_type";`)
}
