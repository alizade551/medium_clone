import { DataSourceOptions, DataSource } from 'typeorm';

export const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'mediumclone',
  username: 'root',
  password: 'root',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  //   migrations: [__dirname + '/migrations/**/*{.ts,js}'],
};

const PostgresDataSource = new DataSource({
  ...ormConfig,
});

PostgresDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default PostgresDataSource;
