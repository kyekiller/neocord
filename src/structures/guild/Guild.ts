/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import { Snowflake } from "@neocord/utils";
import { Base } from "../Base";
import { WelcomeScreen } from "./welcome/WelcomeScreen";

import type { InternalShard } from "@neocord/gateway";
import type {
  APIGuild,
  GuildExplicitContentFilter,
  GuildFeature,
  GuildPremiumTier,
  GuildSystemChannelFlags,
  GuildVerificationLevel
} from "discord-api-types/default";
import type { Client } from "../../lib";

export class Guild extends Base {
  /**
   * The ID of this guild.
   */
  public readonly id: string;

  /**
   * The shard that this guild operates on.
   */
  public readonly shard: InternalShard;

  /**
   * The name of this guild.
   */
  public name!: string;

  /**
   * The ID of the AFK Voice Channel.
   */
  public afkChannelId!: string | null;

  /**
   * AFK Timeout in seconds.
   */
  public afkTimeout!: number | null;

  /**
   * Approximate number of members in this guild.
   */
  public approximateMemberCount!: number | null;

  /**
   * Approximate number of non-offline members in this guild.
   */
  public approximatePresenceCount!: number | null;

  /**
   * The hash of the guild banner,
   */
  public banner!: string | null;

  /**
   * The description of this guild, if the guild is discoverable.
   */
  public description!: string | null;

  /**
   * The discovery splash hash, only for guilds that are discoverable.
   */
  public discoverySplash!: string | null;

  /**
   * The explicit content filter config.
   */
  public contentFilter!: GuildExplicitContentFilter;

  /**
   * Enabled guild features.
   */
  public features!: GuildFeature[];

  /**
   * Timestamp for when the client joined the guild.
   */
  public joinedTimestamp!: number | null;

  /**
   * Whether this guild is considered a large guild.
   */
  public large!: boolean;

  /**
   * The maximum number of members allowed in this guild.
   */
  public maxMembers?: number;

  /**
   * The maximum number of presences for this guild.
   */
  public maxPresences!: number;

  /**
   * The maximum amount of users in a video channel
   */
  public maxVideoChannelUsers!: number | null;

  /**
   * Total number of members in this guild
   */
  public memberCount!: number | null;

  /**
   * The ID of the user who owns this guild.
   */
  public ownerId!: string;

  /**
   * The preferred locale of a guild with the PUBLIC feature, defaults to "en-US".
   */
  public preferredLocale!: string;

  /**
   * The number of boosts this guild currently has.
   */
  public boostCount!: number;

  /**
   * The current boost tier of this guild.
   */
  public boostTier!: GuildPremiumTier;

  /**
   * The ID of the channel where admins/moderators of guilds with the PUBLIC feature will receives notices from Discord.
   */
  public updatesChannelId!: string | null;

  /**
   * The voice region of this guild.
   */
  public region!: string;

  /**
   * The ID of the channel where guilds with the PUBLIC feature can display rules and/or guidelines.
   */
  public rulesChannelId!: string | null;

  /**
   * System channel flags.
   */
  public systemChannelFlags!: GuildSystemChannelFlags;

  /**
   * The id of the channel where guild notices such as welcome messages and boost events are posted.
   */
  public systemChannelId!: string | null;

  /**
   * The vanity invite code for this server.
   */
  public vanityURLCode!: string | null;

  /**
   * Verification level required for this guild.
   */
  public verificationLevel!: GuildVerificationLevel;

  /**
   * The icon hash.
   */
  public icon!: string | null;

  /**
   * The welcome screen, only for community servers.
   */
  public welcomeScreen?: WelcomeScreen;

  /**
   * Whether this guild is unavailable or not.
   */
  public unavailable!: boolean;

  /**
   * Creates a new instance of Guild.
   * @param client
   * @param data
   */
  public constructor(client: Client, data: APIGuild) {
    super(client);

    this.id = data.id;

    const shardId = this.snowflake.timestamp % client.ws.shards.size;
    this.shard = this.client.ws.shards.get(shardId) as InternalShard;
    this._patch(data);
  }

  /**
   * The date when this guild was created.
   */
  public get createdAt(): Date {
    return new Date(this.createdTimestamp);
  }

  /**
   * Timestamp of when this guild was created.
   */
  public get createdTimestamp(): number {
    return this.snowflake.timestamp;
  }

  /**
   * The snowflake data.
   */
  public get snowflake(): Snowflake {
    return new Snowflake(this.id);
  }

  /**
   * Updates this guild with data from the api.
   * @protected
   */
  protected _patch(data: APIGuild): this {
    this.name = data.name;
    this.afkChannelId = data.afk_channel_id;
    this.afkTimeout = data.afk_timeout;
    this.approximateMemberCount = data.approximate_member_count ?? null;
    this.approximatePresenceCount = data.approximate_presence_count ?? null;
    this.banner = data.banner;
    this.description = data.description;
    this.discoverySplash = data.discovery_splash;
    this.contentFilter = data.explicit_content_filter;
    this.features = data.features;
    this.joinedTimestamp = data.joined_at ? Date.parse(data.joined_at) : null;
    this.large = data.large ?? false;
    this.maxMembers = data.max_members;
    this.maxPresences = data.max_presences == null ? 25000 : data.max_presences;
    this.maxVideoChannelUsers = data.max_video_channel_users ?? null;
    this.memberCount = data.member_count ?? null;
    this.ownerId = data.owner_id;
    this.preferredLocale = data.preferred_locale;
    this.boostCount = data.premium_subscription_count ?? 0;
    this.boostTier = data.premium_tier;
    this.updatesChannelId = data.public_updates_channel_id;
    this.region = data.region;
    this.rulesChannelId = data.rules_channel_id;
    this.systemChannelFlags = data.system_channel_flags;
    this.systemChannelId = data.system_channel_id;
    this.vanityURLCode = data.vanity_url_code;
    this.verificationLevel = data.verification_level;
    this.icon = data.icon;
    this.unavailable = data.unavailable ?? false;

    if (data.welcome_screen) {
      if (!this.welcomeScreen) this.welcomeScreen = new WelcomeScreen(this, data.welcome_screen);
      else this.welcomeScreen["_patch"](data.welcome_screen);
    }

    return this;
  }
}