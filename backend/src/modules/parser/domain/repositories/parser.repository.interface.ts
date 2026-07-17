import { ParserEntity } from '../entities/parser.entity';

export interface IParserRepository {
  findById(id: string): Promise<ParserEntity | null>;
  findAll(): Promise<ParserEntity[]>;
  create(entity: Partial<ParserEntity>): Promise<ParserEntity>;
  update(id: string, entity: Partial<ParserEntity>): Promise<ParserEntity>;
  delete(id: string): Promise<boolean>;
}
