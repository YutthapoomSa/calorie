import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { FoodDB } from './food.entity';
import { OtherFoodDB } from './other-food.entity';
import { UserDB } from './user.entity';

@Table({
    tableName: 'report',
})
export class ReportDB extends Model<ReportDB> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: 'unique_reportId',
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.INTEGER,
    })
    height: number;

    @Column({
        type: DataType.INTEGER,
    })
    weight: number;

    @Column({
        type: DataType.INTEGER,
    })
    unit: number;

    @Column({
        type: DataType.INTEGER,
    })
    calorie: number;

    @Column({})
    foodName: string;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
    })
    bmiTotal: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
    })
    bmrTotal: number;

    @Column({
        defaultValue: false,
        allowNull: false,
    })
    isDelete: boolean;

    // ────────────────────────────────────────────────────────────────────────────────
    @ForeignKey(() => UserDB)
    @Column({
        allowNull: true,
        type: DataType.UUID,
    })
    userId: string;

    @BelongsTo(() => UserDB)
    user: UserDB;

    @ForeignKey(() => OtherFoodDB)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    otherFoodId: number;

    @BelongsTo(() => OtherFoodDB)
    otherFoodIdList: OtherFoodDB;

    @ForeignKey(() => FoodDB)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    foodId: number;

    @BelongsTo(() => FoodDB)
    foodLists: FoodDB;

    // @ForeignKey(() => FoodDB)
    // @Column({
    //     type: DataType.INTEGER,
    //     allowNull: true,
    // })
    // foodId: number;

    // @BelongsTo(() => FoodDB)
    // foodLists: FoodDB;
}
