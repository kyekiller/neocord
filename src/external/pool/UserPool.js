/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import { ResourcePool } from "../abstract/ResourcePool";
import { resources } from "../resource/Resources";

export class UserPool extends ResourcePool {
  /**
   * @param {Client} client The client.
   */
  constructor(client) {
    super(client, {
      limit: client.caching.limitFor("user"),
      class: resources.get("User")
    });
  }

  /**
   * Fetches a user from the API.
   * @param {string} id ID of the User to fetch.
   * @param {FetchUserOptions} [options] Fetch options.
   * @return {Promise<User>}
   */
  async fetch(id, { cache = true, force = false } = {}) {
    if (!force && this.has(id)) {
      return this.get(id);
    }

    const data = await this.client.rest.get(`/users/${id}`),
      user = this._create(data);

    if (cache) {
      this._set(user);
    }

    return user;
  }
}

/**
 * @typedef {Object} FetchUserOptions
 * @property {boolean} [cache] Whether to cache the fetched user.
 * @property {boolean} [force] Whether to force fetch instead of checking if the provided user is already cached,
 */
