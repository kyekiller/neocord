/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

export function define(descriptor: Omit<PropertyDescriptor, "value" | "get" | "set">): PropertyDecorator {
  return (target, propertyKey) => {
    Object.defineProperty(target, propertyKey, {
      ...descriptor,
      value: Reflect.get(target, propertyKey)
    });
  };
}
