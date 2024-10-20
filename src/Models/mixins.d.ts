/**
 * @file Sequelize model for followed members.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/FollowedMember
 */
import {
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type BelongsToCreateAssociationMixin,
  type HasManyGetAssociationsMixin,
  type HasManyCountAssociationsMixin,
  type HasManyHasAssociationsMixin,
  type HasManySetAssociationsMixin,
  type HasManyAddAssociationsMixin,
  type HasManyRemoveAssociationsMixin,
  type HasManyHasAssociationMixin,
  type HasManyAddAssociationMixin,
  type HasManyRemoveAssociationMixin,
  type HasManyCreateAssociationMixin,
  type HasOneGetAssociationMixin,
  type HasOneSetAssociationMixin,
  type HasOneCreateAssociationMixin,
} from '@sequelize/core';

declare global {
  // define helper types
  type PostfixProperties<PropTypes, Postfix extends string> = {
    [P in keyof PropTypes as `${Exclude<P, symbol>}${Postfix}`]: PropTypes[P];
  };

  type Prettify<T> = { [P in keyof T]: T[P] };

  // association mixin interfaces
  type BelongsToMixin<
    AssociatedModel extends Model,
    PrimaryKeyType,
    Name extends string,
  > = PostfixProperties<
    {
      get: BelongsToGetAssociationMixin<AssociatedModel>;
      set: BelongsToSetAssociationMixin<AssociatedModel, PrimaryKeyType>;
      create: BelongsToCreateAssociationMixin<AssociatedModel>;
    },
    Capitalize<Name>
  >;

  type BelongsToManyMixin<
    AssociatedModel extends Model,
    PrimaryKeyType,
    SingularName extends string,
    PluralName extends string,
  > = Prettify<
    PostfixProperties<
      {
        get: HasManyGetAssociationsMixin<AssociatedModel>;
        count: HasManyCountAssociationsMixin<AssociatedModel>;
        has: HasManyHasAssociationsMixin<AssociatedModel, PrimaryKeyType>;
        set: HasManySetAssociationsMixin<AssociatedModel, PrimaryKeyType>;
        add: HasManyAddAssociationsMixin<AssociatedModel, PrimaryKeyType>;
        remove: HasManyRemoveAssociationsMixin<AssociatedModel, PrimaryKeyType>;
      },
      Capitalize<PluralName>
    > &
      PostfixProperties<
        {
          has: HasManyHasAssociationMixin<AssociatedModel, PrimaryKeyType>;
          add: HasManyAddAssociationMixin<AssociatedModel, PrimaryKeyType>;
          remove: HasManyRemoveAssociationMixin<
            AssociatedModel,
            PrimaryKeyType
          >;
          create: HasManyCreateAssociationMixin<AssociatedModel>;
        },
        Capitalize<SingularName>
      >
  >;

  type HasOneMixin<
    AssociatedModel extends Model,
    PrimaryKeyType,
    Name extends string,
  > = PostfixProperties<
    {
      get: HasOneGetAssociationMixin<AssociatedModel>;
      set: HasOneSetAssociationMixin<AssociatedModel, PrimaryKeyType>;
      create: HasOneCreateAssociationMixin<AssociatedModel>;
    },
    Capitalize<Name>
  >;

  type HasManyMixin<
    AssociatedModel extends Model,
    PrimaryKeyType,
    SingularName extends string,
    PluralName extends string,
  > = Prettify<
    PostfixProperties<
      {
        get: HasManyGetAssociationsMixin<AssociatedModel>;
        count: HasManyCountAssociationsMixin<AssociatedModel>;
        has: HasManyHasAssociationsMixin<AssociatedModel, PrimaryKeyType>;
        set: HasManySetAssociationsMixin<AssociatedModel, PrimaryKeyType>;
        add: HasManyAddAssociationsMixin<AssociatedModel, PrimaryKeyType>;
        remove: HasManyRemoveAssociationsMixin<AssociatedModel, PrimaryKeyType>;
      },
      Capitalize<PluralName>
    > &
      PostfixProperties<
        {
          has: HasManyHasAssociationMixin<AssociatedModel, PrimaryKeyType>;
          add: HasManyAddAssociationMixin<AssociatedModel, PrimaryKeyType>;
          remove: HasManyRemoveAssociationMixin<
            AssociatedModel,
            PrimaryKeyType
          >;
          create: HasManyCreateAssociationMixin<AssociatedModel>;
        },
        Capitalize<SingularName>
      >
  >;
}
export {};
