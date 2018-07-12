import { HcgPage } from './app.po';

describe('hcg App', () => {
  let page: HcgPage;

  beforeEach(() => {
    page = new HcgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
