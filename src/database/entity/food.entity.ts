import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import { FoodTypeDB } from './food-type.entity';
import { ReportDB } from './report.entity';
import { UserDB } from './user.entity';

// export enum FoodTypeRole {
//     superAdmin = 'superAdmin',
//     admin = 'admin',
//     user = 'user',
// }

@Table({
    tableName: 'food',
})
export class FoodDB extends Model<FoodDB> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: 'unique_food_id',
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        comment: 'ชื่ออาหาร',
    })
    name: string;

    @Column({
        comment: 'แคลอรี่อาหาร',
    })
    calorie: number;

    @CreatedAt
    readonly createdAt?: Date;

    @UpdatedAt
    readonly updatedAt?: Date;

    // ────────────────────────────────────────────────────────────────────────────────

    // @HasMany(() => FoodDB)
    // FoodLists : FoodDB[];

    @ForeignKey(() => FoodTypeDB)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: 'unique_food_type_id',
    })
    foodTypeId: number;

    @BelongsTo(() => FoodTypeDB)
    foodTypeList: FoodTypeDB;

    @ForeignKey(() => UserDB)
    @Column({
        type: DataType.UUID,
        allowNull: true,
        defaultValue: null,
    })
    userId: string;

    @BelongsTo(() => UserDB)
    userList: UserDB;

    @HasMany(() => ReportDB)
    reportDBLists: ReportDB[];

    // @BelongsTo(() => FoodTypeDB)
    // foodTypeList: FoodTypeDB;

    // ────────────────────────────────────────────────────────────────────────────────

    // @HasMany(() => ReportDB)
    // reportLists: ReportDB[];
}
