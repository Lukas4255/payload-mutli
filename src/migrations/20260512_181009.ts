import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_links_link_block_type" AS ENUM('archive', 'cta', 'content', 'formBlock', 'mediaBlock', 'vacanciesBlock', 'uspBlock', 'agendaBlock', 'imageTextBlock');
  CREATE TYPE "public"."enum_pages_blocks_cta_link_block_type" AS ENUM('archive', 'cta', 'content', 'formBlock', 'mediaBlock', 'vacanciesBlock', 'uspBlock', 'agendaBlock', 'imageTextBlock');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_block_type" AS ENUM('archive', 'cta', 'content', 'formBlock', 'mediaBlock', 'vacanciesBlock', 'uspBlock', 'agendaBlock', 'imageTextBlock');
  CREATE TYPE "public"."enum_pages_blocks_archive_link_block_type" AS ENUM('archive', 'cta', 'content', 'formBlock', 'mediaBlock', 'vacanciesBlock', 'uspBlock', 'agendaBlock', 'imageTextBlock');
  CREATE TYPE "public"."enum_pages_blocks_vacancies_block_view_all_link_block_type" AS ENUM('archive', 'cta', 'content', 'formBlock', 'mediaBlock', 'vacanciesBlock', 'uspBlock', 'agendaBlock', 'imageTextBlock');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_block_type" AS ENUM('archive', 'cta', 'content', 'formBlock', 'mediaBlock', 'vacanciesBlock', 'uspBlock', 'agendaBlock', 'imageTextBlock');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_link_block_type" AS ENUM('archive', 'cta', 'content', 'formBlock', 'mediaBlock', 'vacanciesBlock', 'uspBlock', 'agendaBlock', 'imageTextBlock');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_block_type" AS ENUM('archive', 'cta', 'content', 'formBlock', 'mediaBlock', 'vacanciesBlock', 'uspBlock', 'agendaBlock', 'imageTextBlock');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_link_block_type" AS ENUM('archive', 'cta', 'content', 'formBlock', 'mediaBlock', 'vacanciesBlock', 'uspBlock', 'agendaBlock', 'imageTextBlock');
  CREATE TYPE "public"."enum__pages_v_blocks_vacancies_block_view_all_link_block_type" AS ENUM('archive', 'cta', 'content', 'formBlock', 'mediaBlock', 'vacanciesBlock', 'uspBlock', 'agendaBlock', 'imageTextBlock');
  CREATE TYPE "public"."enum_header_nav_items_link_block_type" AS ENUM('archive', 'cta', 'content', 'formBlock', 'mediaBlock', 'vacanciesBlock', 'uspBlock', 'agendaBlock', 'imageTextBlock');
  CREATE TYPE "public"."enum_footer_menu_items_link_block_type" AS ENUM('archive', 'cta', 'content', 'formBlock', 'mediaBlock', 'vacanciesBlock', 'uspBlock', 'agendaBlock', 'imageTextBlock');
  CREATE TYPE "public"."enum_footer_social_items_link_block_type" AS ENUM('archive', 'cta', 'content', 'formBlock', 'mediaBlock', 'vacanciesBlock', 'uspBlock', 'agendaBlock', 'imageTextBlock');
  CREATE TYPE "public"."enum_footer_legal_items_link_block_type" AS ENUM('archive', 'cta', 'content', 'formBlock', 'mediaBlock', 'vacanciesBlock', 'uspBlock', 'agendaBlock', 'imageTextBlock');
  ALTER TYPE "public"."enum_pages_hero_links_link_type" ADD VALUE 'block';
  ALTER TYPE "public"."enum_pages_blocks_cta_link_type" ADD VALUE 'block';
  ALTER TYPE "public"."enum_pages_blocks_content_columns_link_type" ADD VALUE 'block';
  ALTER TYPE "public"."enum_pages_blocks_archive_link_type" ADD VALUE 'block';
  ALTER TYPE "public"."enum_pages_blocks_vacancies_block_view_all_link_type" ADD VALUE 'block';
  ALTER TYPE "public"."enum__pages_v_version_hero_links_link_type" ADD VALUE 'block';
  ALTER TYPE "public"."enum__pages_v_blocks_cta_link_type" ADD VALUE 'block';
  ALTER TYPE "public"."enum__pages_v_blocks_content_columns_link_type" ADD VALUE 'block';
  ALTER TYPE "public"."enum__pages_v_blocks_archive_link_type" ADD VALUE 'block';
  ALTER TYPE "public"."enum__pages_v_blocks_vacancies_block_view_all_link_type" ADD VALUE 'block';
  ALTER TYPE "public"."enum_header_nav_items_link_type" ADD VALUE 'block';
  ALTER TYPE "public"."enum_footer_menu_items_link_type" ADD VALUE 'block';
  ALTER TYPE "public"."enum_footer_social_items_link_type" ADD VALUE 'block';
  ALTER TYPE "public"."enum_footer_legal_items_link_type" ADD VALUE 'block';
  CREATE TABLE "pages_blocks_agenda_block_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"date" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_agenda_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"rich_text" jsonb,
  	"image_id" integer,
  	"mirrored" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_agenda_block_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"date" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_agenda_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"rich_text" jsonb,
  	"image_id" integer,
  	"mirrored" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_hero_links" ADD COLUMN "link_block_type" "enum_pages_hero_links_link_block_type";
  ALTER TABLE "pages_hero_links" ADD COLUMN "link_block_index" numeric DEFAULT 0;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "link_block_type" "enum_pages_blocks_cta_link_block_type";
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "link_block_index" numeric DEFAULT 0;
  ALTER TABLE "pages_blocks_content_columns" ADD COLUMN "link_block_type" "enum_pages_blocks_content_columns_link_block_type";
  ALTER TABLE "pages_blocks_content_columns" ADD COLUMN "link_block_index" numeric DEFAULT 0;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "link_block_type" "enum_pages_blocks_archive_link_block_type";
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "link_block_index" numeric DEFAULT 0;
  ALTER TABLE "pages_blocks_vacancies_block" ADD COLUMN "view_all_link_block_type" "enum_pages_blocks_vacancies_block_view_all_link_block_type";
  ALTER TABLE "pages_blocks_vacancies_block" ADD COLUMN "view_all_link_block_index" numeric DEFAULT 0;
  ALTER TABLE "_pages_v_version_hero_links" ADD COLUMN "link_block_type" "enum__pages_v_version_hero_links_link_block_type";
  ALTER TABLE "_pages_v_version_hero_links" ADD COLUMN "link_block_index" numeric DEFAULT 0;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "link_block_type" "enum__pages_v_blocks_cta_link_block_type";
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "link_block_index" numeric DEFAULT 0;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD COLUMN "link_block_type" "enum__pages_v_blocks_content_columns_link_block_type";
  ALTER TABLE "_pages_v_blocks_content_columns" ADD COLUMN "link_block_index" numeric DEFAULT 0;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "link_block_type" "enum__pages_v_blocks_archive_link_block_type";
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "link_block_index" numeric DEFAULT 0;
  ALTER TABLE "_pages_v_blocks_vacancies_block" ADD COLUMN "view_all_link_block_type" "enum__pages_v_blocks_vacancies_block_view_all_link_block_type";
  ALTER TABLE "_pages_v_blocks_vacancies_block" ADD COLUMN "view_all_link_block_index" numeric DEFAULT 0;
  ALTER TABLE "tenants" ADD COLUMN "favicon_id" integer;
  ALTER TABLE "header_nav_items" ADD COLUMN "link_block_type" "enum_header_nav_items_link_block_type";
  ALTER TABLE "header_nav_items" ADD COLUMN "link_block_index" numeric DEFAULT 0;
  ALTER TABLE "footer_menu_items" ADD COLUMN "link_block_type" "enum_footer_menu_items_link_block_type";
  ALTER TABLE "footer_menu_items" ADD COLUMN "link_block_index" numeric DEFAULT 0;
  ALTER TABLE "footer_social_items" ADD COLUMN "link_block_type" "enum_footer_social_items_link_block_type";
  ALTER TABLE "footer_social_items" ADD COLUMN "link_block_index" numeric DEFAULT 0;
  ALTER TABLE "footer_legal_items" ADD COLUMN "link_block_type" "enum_footer_legal_items_link_block_type";
  ALTER TABLE "footer_legal_items" ADD COLUMN "link_block_index" numeric DEFAULT 0;
  ALTER TABLE "pages_blocks_agenda_block_events" ADD CONSTRAINT "pages_blocks_agenda_block_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_agenda_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_agenda_block" ADD CONSTRAINT "pages_blocks_agenda_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text_block" ADD CONSTRAINT "pages_blocks_image_text_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text_block" ADD CONSTRAINT "pages_blocks_image_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_agenda_block_events" ADD CONSTRAINT "_pages_v_blocks_agenda_block_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_agenda_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_agenda_block" ADD CONSTRAINT "_pages_v_blocks_agenda_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text_block" ADD CONSTRAINT "_pages_v_blocks_image_text_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text_block" ADD CONSTRAINT "_pages_v_blocks_image_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_agenda_block_events_order_idx" ON "pages_blocks_agenda_block_events" USING btree ("_order");
  CREATE INDEX "pages_blocks_agenda_block_events_parent_id_idx" ON "pages_blocks_agenda_block_events" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_agenda_block_order_idx" ON "pages_blocks_agenda_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_agenda_block_parent_id_idx" ON "pages_blocks_agenda_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_agenda_block_path_idx" ON "pages_blocks_agenda_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_block_order_idx" ON "pages_blocks_image_text_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_text_block_parent_id_idx" ON "pages_blocks_image_text_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_text_block_path_idx" ON "pages_blocks_image_text_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_block_image_idx" ON "pages_blocks_image_text_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_agenda_block_events_order_idx" ON "_pages_v_blocks_agenda_block_events" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_agenda_block_events_parent_id_idx" ON "_pages_v_blocks_agenda_block_events" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_agenda_block_order_idx" ON "_pages_v_blocks_agenda_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_agenda_block_parent_id_idx" ON "_pages_v_blocks_agenda_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_agenda_block_path_idx" ON "_pages_v_blocks_agenda_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_block_order_idx" ON "_pages_v_blocks_image_text_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_text_block_parent_id_idx" ON "_pages_v_blocks_image_text_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_text_block_path_idx" ON "_pages_v_blocks_image_text_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_block_image_idx" ON "_pages_v_blocks_image_text_block" USING btree ("image_id");
  ALTER TABLE "tenants" ADD CONSTRAINT "tenants_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "tenants_favicon_idx" ON "tenants" USING btree ("favicon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_agenda_block_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_agenda_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_agenda_block_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_agenda_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_image_text_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_agenda_block_events" CASCADE;
  DROP TABLE "pages_blocks_agenda_block" CASCADE;
  DROP TABLE "pages_blocks_image_text_block" CASCADE;
  DROP TABLE "_pages_v_blocks_agenda_block_events" CASCADE;
  DROP TABLE "_pages_v_blocks_agenda_block" CASCADE;
  DROP TABLE "_pages_v_blocks_image_text_block" CASCADE;
  ALTER TABLE "tenants" DROP CONSTRAINT "tenants_favicon_id_media_id_fk";
  
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_type" SET DEFAULT 'reference'::text;
  DROP TYPE "public"."enum_pages_hero_links_link_type";
  CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_type" SET DEFAULT 'reference'::"public"."enum_pages_hero_links_link_type";
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_hero_links_link_type" USING "link_type"::"public"."enum_pages_hero_links_link_type";
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "link_type" SET DEFAULT 'reference'::text;
  DROP TYPE "public"."enum_pages_blocks_cta_link_type";
  CREATE TYPE "public"."enum_pages_blocks_cta_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "link_type" SET DEFAULT 'reference'::"public"."enum_pages_blocks_cta_link_type";
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_blocks_cta_link_type" USING "link_type"::"public"."enum_pages_blocks_cta_link_type";
  ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "link_type" SET DEFAULT 'reference'::text;
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_type";
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "link_type" SET DEFAULT 'reference'::"public"."enum_pages_blocks_content_columns_link_type";
  ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_blocks_content_columns_link_type" USING "link_type"::"public"."enum_pages_blocks_content_columns_link_type";
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "link_type" SET DEFAULT 'reference'::text;
  DROP TYPE "public"."enum_pages_blocks_archive_link_type";
  CREATE TYPE "public"."enum_pages_blocks_archive_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "link_type" SET DEFAULT 'reference'::"public"."enum_pages_blocks_archive_link_type";
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_blocks_archive_link_type" USING "link_type"::"public"."enum_pages_blocks_archive_link_type";
  ALTER TABLE "pages_blocks_vacancies_block" ALTER COLUMN "view_all_link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_vacancies_block" ALTER COLUMN "view_all_link_type" SET DEFAULT 'reference'::text;
  DROP TYPE "public"."enum_pages_blocks_vacancies_block_view_all_link_type";
  CREATE TYPE "public"."enum_pages_blocks_vacancies_block_view_all_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "pages_blocks_vacancies_block" ALTER COLUMN "view_all_link_type" SET DEFAULT 'reference'::"public"."enum_pages_blocks_vacancies_block_view_all_link_type";
  ALTER TABLE "pages_blocks_vacancies_block" ALTER COLUMN "view_all_link_type" SET DATA TYPE "public"."enum_pages_blocks_vacancies_block_view_all_link_type" USING "view_all_link_type"::"public"."enum_pages_blocks_vacancies_block_view_all_link_type";
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_type" SET DEFAULT 'reference'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_type" SET DEFAULT 'reference'::"public"."enum__pages_v_version_hero_links_link_type";
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_version_hero_links_link_type" USING "link_type"::"public"."enum__pages_v_version_hero_links_link_type";
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "link_type" SET DEFAULT 'reference'::text;
  DROP TYPE "public"."enum__pages_v_blocks_cta_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_cta_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "link_type" SET DEFAULT 'reference'::"public"."enum__pages_v_blocks_cta_link_type";
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_blocks_cta_link_type" USING "link_type"::"public"."enum__pages_v_blocks_cta_link_type";
  ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "link_type" SET DEFAULT 'reference'::text;
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "link_type" SET DEFAULT 'reference'::"public"."enum__pages_v_blocks_content_columns_link_type";
  ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_blocks_content_columns_link_type" USING "link_type"::"public"."enum__pages_v_blocks_content_columns_link_type";
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "link_type" SET DEFAULT 'reference'::text;
  DROP TYPE "public"."enum__pages_v_blocks_archive_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_archive_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "link_type" SET DEFAULT 'reference'::"public"."enum__pages_v_blocks_archive_link_type";
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_blocks_archive_link_type" USING "link_type"::"public"."enum__pages_v_blocks_archive_link_type";
  ALTER TABLE "_pages_v_blocks_vacancies_block" ALTER COLUMN "view_all_link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_vacancies_block" ALTER COLUMN "view_all_link_type" SET DEFAULT 'reference'::text;
  DROP TYPE "public"."enum__pages_v_blocks_vacancies_block_view_all_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_vacancies_block_view_all_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "_pages_v_blocks_vacancies_block" ALTER COLUMN "view_all_link_type" SET DEFAULT 'reference'::"public"."enum__pages_v_blocks_vacancies_block_view_all_link_type";
  ALTER TABLE "_pages_v_blocks_vacancies_block" ALTER COLUMN "view_all_link_type" SET DATA TYPE "public"."enum__pages_v_blocks_vacancies_block_view_all_link_type" USING "view_all_link_type"::"public"."enum__pages_v_blocks_vacancies_block_view_all_link_type";
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_type" SET DEFAULT 'reference'::text;
  DROP TYPE "public"."enum_header_nav_items_link_type";
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_type" SET DEFAULT 'reference'::"public"."enum_header_nav_items_link_type";
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_header_nav_items_link_type" USING "link_type"::"public"."enum_header_nav_items_link_type";
  ALTER TABLE "footer_menu_items" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "footer_menu_items" ALTER COLUMN "link_type" SET DEFAULT 'reference'::text;
  DROP TYPE "public"."enum_footer_menu_items_link_type";
  CREATE TYPE "public"."enum_footer_menu_items_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "footer_menu_items" ALTER COLUMN "link_type" SET DEFAULT 'reference'::"public"."enum_footer_menu_items_link_type";
  ALTER TABLE "footer_menu_items" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_footer_menu_items_link_type" USING "link_type"::"public"."enum_footer_menu_items_link_type";
  ALTER TABLE "footer_social_items" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "footer_social_items" ALTER COLUMN "link_type" SET DEFAULT 'reference'::text;
  DROP TYPE "public"."enum_footer_social_items_link_type";
  CREATE TYPE "public"."enum_footer_social_items_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "footer_social_items" ALTER COLUMN "link_type" SET DEFAULT 'reference'::"public"."enum_footer_social_items_link_type";
  ALTER TABLE "footer_social_items" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_footer_social_items_link_type" USING "link_type"::"public"."enum_footer_social_items_link_type";
  ALTER TABLE "footer_legal_items" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "footer_legal_items" ALTER COLUMN "link_type" SET DEFAULT 'reference'::text;
  DROP TYPE "public"."enum_footer_legal_items_link_type";
  CREATE TYPE "public"."enum_footer_legal_items_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "footer_legal_items" ALTER COLUMN "link_type" SET DEFAULT 'reference'::"public"."enum_footer_legal_items_link_type";
  ALTER TABLE "footer_legal_items" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_footer_legal_items_link_type" USING "link_type"::"public"."enum_footer_legal_items_link_type";
  DROP INDEX "tenants_favicon_idx";
  ALTER TABLE "pages_hero_links" DROP COLUMN "link_block_type";
  ALTER TABLE "pages_hero_links" DROP COLUMN "link_block_index";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "link_block_type";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "link_block_index";
  ALTER TABLE "pages_blocks_content_columns" DROP COLUMN "link_block_type";
  ALTER TABLE "pages_blocks_content_columns" DROP COLUMN "link_block_index";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "link_block_type";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "link_block_index";
  ALTER TABLE "pages_blocks_vacancies_block" DROP COLUMN "view_all_link_block_type";
  ALTER TABLE "pages_blocks_vacancies_block" DROP COLUMN "view_all_link_block_index";
  ALTER TABLE "_pages_v_version_hero_links" DROP COLUMN "link_block_type";
  ALTER TABLE "_pages_v_version_hero_links" DROP COLUMN "link_block_index";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "link_block_type";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "link_block_index";
  ALTER TABLE "_pages_v_blocks_content_columns" DROP COLUMN "link_block_type";
  ALTER TABLE "_pages_v_blocks_content_columns" DROP COLUMN "link_block_index";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "link_block_type";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "link_block_index";
  ALTER TABLE "_pages_v_blocks_vacancies_block" DROP COLUMN "view_all_link_block_type";
  ALTER TABLE "_pages_v_blocks_vacancies_block" DROP COLUMN "view_all_link_block_index";
  ALTER TABLE "tenants" DROP COLUMN "favicon_id";
  ALTER TABLE "header_nav_items" DROP COLUMN "link_block_type";
  ALTER TABLE "header_nav_items" DROP COLUMN "link_block_index";
  ALTER TABLE "footer_menu_items" DROP COLUMN "link_block_type";
  ALTER TABLE "footer_menu_items" DROP COLUMN "link_block_index";
  ALTER TABLE "footer_social_items" DROP COLUMN "link_block_type";
  ALTER TABLE "footer_social_items" DROP COLUMN "link_block_index";
  ALTER TABLE "footer_legal_items" DROP COLUMN "link_block_type";
  ALTER TABLE "footer_legal_items" DROP COLUMN "link_block_index";
  DROP TYPE "public"."enum_pages_hero_links_link_block_type";
  DROP TYPE "public"."enum_pages_blocks_cta_link_block_type";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_block_type";
  DROP TYPE "public"."enum_pages_blocks_archive_link_block_type";
  DROP TYPE "public"."enum_pages_blocks_vacancies_block_view_all_link_block_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_block_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_link_block_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_block_type";
  DROP TYPE "public"."enum__pages_v_blocks_archive_link_block_type";
  DROP TYPE "public"."enum__pages_v_blocks_vacancies_block_view_all_link_block_type";
  DROP TYPE "public"."enum_header_nav_items_link_block_type";
  DROP TYPE "public"."enum_footer_menu_items_link_block_type";
  DROP TYPE "public"."enum_footer_social_items_link_block_type";
  DROP TYPE "public"."enum_footer_legal_items_link_block_type";`)
}
