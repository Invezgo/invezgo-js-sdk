import { HttpClient } from './client';
import { AlertsEndpoints } from './endpoints/alerts';
import { AnalysisEndpoints } from './endpoints/analysis';
import { WatchlistsEndpoints } from './endpoints/watchlists';
import { JournalsEndpoints } from './endpoints/journals';
import { PortfoliosEndpoints } from './endpoints/portfolios';
import { SearchEndpoints } from './endpoints/search';
import { ProfileEndpoints } from './endpoints/profile';
import { MembershipEndpoints } from './endpoints/membership';
import { PostsEndpoints } from './endpoints/posts';
import { RecommendationEndpoints } from './endpoints/recommendation';
import { TradesEndpoints } from './endpoints/trades';
import { ScreenerEndpoints } from './endpoints/screener';
import type { InvezgoConfig } from './types';

export class Invezgo {
  public readonly alerts: AlertsEndpoints;
  public readonly analysis: AnalysisEndpoints;
  public readonly watchlists: WatchlistsEndpoints;
  public readonly journals: JournalsEndpoints;
  public readonly portfolios: PortfoliosEndpoints;
  public readonly search: SearchEndpoints;
  public readonly profile: ProfileEndpoints;
  public readonly membership: MembershipEndpoints;
  public readonly posts: PostsEndpoints;
  public readonly recommendation: RecommendationEndpoints;
  public readonly trades: TradesEndpoints;
  public readonly screener: ScreenerEndpoints;

  private client: HttpClient;

  constructor(config: InvezgoConfig) {
    this.client = new HttpClient(config);

    this.alerts = new AlertsEndpoints(this.client);
    this.analysis = new AnalysisEndpoints(this.client);
    this.watchlists = new WatchlistsEndpoints(this.client);
    this.journals = new JournalsEndpoints(this.client);
    this.portfolios = new PortfoliosEndpoints(this.client);
    this.search = new SearchEndpoints(this.client);
    this.profile = new ProfileEndpoints(this.client);
    this.membership = new MembershipEndpoints(this.client);
    this.posts = new PostsEndpoints(this.client);
    this.recommendation = new RecommendationEndpoints(this.client);
    this.trades = new TradesEndpoints(this.client);
    this.screener = new ScreenerEndpoints(this.client);
  }

  /**
   * Update API key.
   */
  setApiKey(apiKey: string): void {
    (this.client as { apiKey: string }).apiKey = apiKey;
  }

  /**
   * Check whether an API key is currently configured.
   */
  hasApiKey(): boolean {
    return !!(this.client as { apiKey: string }).apiKey;
  }
}
