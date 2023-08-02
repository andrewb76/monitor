import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1690957711183 implements MigrationInterface {
    name = 'Migrations1690957711183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "phone" ("id" SERIAL NOT NULL, "phone_number" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_f35e6ee6c1232ce6462505c2b25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1199df878885594d633a211cf1" ON "phone" ("phone_number") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1199df878885594d633a211cf1"`);
        await queryRunner.query(`DROP TABLE "phone"`);
    }

}
