import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "tenants_contact_info_departments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"photo_id" integer
  );
  
  ALTER TABLE "tenants_contact_info_departments" ADD CONSTRAINT "tenants_contact_info_departments_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenants_contact_info_departments" ADD CONSTRAINT "tenants_contact_info_departments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tenants_contact_info_departments_order_idx" ON "tenants_contact_info_departments" USING btree ("_order");
  CREATE INDEX "tenants_contact_info_departments_parent_id_idx" ON "tenants_contact_info_departments" USING btree ("_parent_id");
  CREATE INDEX "tenants_contact_info_departments_photo_idx" ON "tenants_contact_info_departments" USING btree ("photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "tenants_contact_info_departments" CASCADE;`)
}
