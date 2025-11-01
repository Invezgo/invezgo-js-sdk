import { HttpClient } from './client';
import { AnalysisEndpoints } from './endpoints/analysis';
import { WatchlistsEndpoints } from './endpoints/watchlists';
import { JournalsEndpoints } from './endpoints/journals';
import { PortfoliosEndpoints } from './endpoints/portfolios';
import { AiEndpoints } from './endpoints/ai';
import { SearchEndpoints } from './endpoints/search';
import { ProfileEndpoints } from './endpoints/profile';
import { MembershipEndpoints } from './endpoints/membership';
import { PostsEndpoints } from './endpoints/posts';
import { TradesEndpoints } from './endpoints/trades';
import { ScreenerEndpoints } from './endpoints/screener';
import { HealthEndpoints } from './endpoints/health';
import type { InvezgoConfig } from './types';

export class Invezgo {
  public readonly analysis: AnalysisEndpoints;
  public readonly watchlists: WatchlistsEndpoints;
  public readonly journals: JournalsEndpoints;
  public readonly portfolios: PortfoliosEndpoints;
  public readonly ai: AiEndpoints;
  public readonly search: SearchEndpoints;
  public readonly profile: ProfileEndpoints;
  public readonly membership: MembershipEndpoints;
  public readonly posts: PostsEndpoints;
  public readonly trades: TradesEndpoints;
  public readonly screener: ScreenerEndpoints;
  public readonly health: HealthEndpoints;

  private client: HttpClient;

  constructor(config: InvezgoConfig) {
    this.client = new HttpClient(config);

    // Initialize all endpoint modules
    this.analysis = new AnalysisEndpoints(this.client);
    this.watchlists = new WatchlistsEndpoints(this.client);
    this.journals = new JournalsEndpoints(this.client);
    this.portfolios = new PortfoliosEndpoints(this.client);
    this.ai = new AiEndpoints(this.client);
    this.search = new SearchEndpoints(this.client);
    this.profile = new ProfileEndpoints(this.client);
    this.membership = new MembershipEndpoints(this.client);
    this.posts = new PostsEndpoints(this.client);
    this.trades = new TradesEndpoints(this.client);
    this.screener = new ScreenerEndpoints(this.client);
    this.health = new HealthEndpoints(this.client);
  }

  /**
   * Update API key
   */
  setApiKey(apiKey: string): void {
    (this.client as any).apiKey = apiKey;
  }

  /**
   * Get current API key (without exposing it)
   */
  hasApiKey(): boolean {
    return !!(this.client as any).apiKey;
  }
}

