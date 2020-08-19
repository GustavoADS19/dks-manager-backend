
exports.up = function(knex) {
  return knex.schema.createTable("demandas", table => {
    table.increments("id").primary().notNullable();
    table.string("agencia").notNullable();
    table.string("demandante").notNullable();
    table.string("material").notNullable();
    table.string("comentario").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("demandas");
};
