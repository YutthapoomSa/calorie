import { OtherFoodDB } from './other-food.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreatedAt, DataType, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { FoodDB } from './food.entity';

@Table({
    tableName: 'foodtype',
})
export class FoodTypeDB extends Model<FoodTypeDB> {
    @Column({
        type: DataType.INTEGER,
        // allowNull: false,
        unique: 'unique_food_type_id',
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        allowNull: false,
        comment: 'ประเภทอาหาร',
    })
    foodTypeName: string;

    @ApiProperty()
    @Column({
        allowNull: false,
        // defaultValue: 'avatar.png',
    })
    image: string;

    @CreatedAt
    readonly createdAt?: Date;

    @UpdatedAt
    readonly updatedAt?: Date;

    // ────────────────────────────────────────────────────────────────────────────────
    @HasMany(() => FoodDB)
    foodLists: FoodDB[];

    @HasMany(() => OtherFoodDB)
    otherFoodLists: OtherFoodDB[];
}
