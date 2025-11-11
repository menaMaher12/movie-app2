import { Test, TestingModule } from '@nestjs/testing';
import { MoviePeopleService } from './movie-people.service';

describe('MoviePeopleService', () => {
  let service: MoviePeopleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviePeopleService],
    }).compile();

    service = module.get<MoviePeopleService>(MoviePeopleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
