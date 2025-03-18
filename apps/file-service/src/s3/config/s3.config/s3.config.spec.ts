import { S3Config } from './s3.config';

describe('S3Config', () => {
  it('should be defined', () => {
    expect(new S3Config()).toBeDefined();
  });
});
