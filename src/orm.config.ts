import { TypeOrmModuleOptions } from '@nestjs/typeorm';

function ormConfig(): TypeOrmModuleOptions {
    const commonConf = {
        SYNCRONIZE: false,
        ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
        MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
        CLI: {
            migrationsDir: 'src/migrations',
        },
        MIGRATIONS_RUN: true,
    };

    let ormconfig: TypeOrmModuleOptions = {
        // name: 'default',
        // type: 'sqlite',
        // database: '../target/db/sqlite-dev-db.sql',
        // logging: true,
        name: 'default',
        type: 'postgres',
        database: process.env.DATABASE_DB_NAME,
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        logging: true,
        synchronize: true,
        entities: commonConf.ENTITIES,
        migrations: commonConf.MIGRATIONS,
        cli: commonConf.CLI,
        migrationsRun: commonConf.MIGRATIONS_RUN,
        ssl: {
            rejectUnauthorized: false,
        },
    };

    if (process.env.BACKEND_ENV === 'prod') {
        ormconfig = {
            name: 'default',
            type: 'postgres',
            database: 'ecommerce',
            host: 'localhost',
            port: 5433,
            username: 'postgres',
            password: '123456789',
            logging: false,
            // logging: true,
            synchronize: commonConf.SYNCRONIZE,
            entities: commonConf.ENTITIES,
            migrations: commonConf.MIGRATIONS,
            cli: commonConf.CLI,
            migrationsRun: commonConf.MIGRATIONS_RUN,
        };
    }

    // if (process.env.BACKEND_ENV === 'test') {
    // ormconfig = {
    //     name: 'default',
    //     type: 'sqlite',
    //     database: ':memory:',
    //     keepConnectionAlive: true,
    //     logging: true,
    //     synchronize: true,
    //     entities: commonConf.ENTITIES,
    //     migrations: commonConf.MIGRATIONS,
    //     cli: commonConf.CLI,
    //     migrationsRun: commonConf.MIGRATIONS_RUN,
    // };
    // }
    return ormconfig;
}

export { ormConfig };
