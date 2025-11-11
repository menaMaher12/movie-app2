import { Test, TestingModule } from '@nestjs/testing';
import { MoviePeopleController } from './movie-people.controller';

describe('MoviePeopleController', () => {
  let controller: MoviePeopleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviePeopleController],
    }).compile();

    controller = module.get<MoviePeopleController>(MoviePeopleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
