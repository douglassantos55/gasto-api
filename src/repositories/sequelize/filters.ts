import sequelize, { Op, WhereOptions } from "sequelize"
import connection from "../../models/connection"
import { Filter, Filters, Condition } from "../types"

export function parseFilters(condition: Condition<any>): WhereOptions {
    // Remove empty values
    Object.keys(condition).forEach((k: string) =>
        (condition[k] == "" || condition[k] == null) && delete condition[k]
    );

    const where: WhereOptions = {}

    Object.keys(condition).forEach((key: string) => {
        const value = condition[key]

        if (typeof value !== "string") {
            const filter = (condition[key] as Filter).filter()

            if (filter) {
                where[key] = filter
            }
        } else {
            where[key] = condition[key] as string
        }
    })

    return where
}

export class SequelizeFilters implements Filters {
    date(value: string, format: string): Filter {
        return new DateFilter(value, format)
    }

    like(value: string): Filter {
        return new LikeFilter(value)
    }
}

class LikeFilter implements Filter {
    private value: string

    constructor(value: string) {
        this.value = value
    }

    filter(): { [key in typeof Op.like]: string } {
        if (this.value) {
            return { [Op.like]: `%${this.value}%` }
        }
    }
}

class DateFilter implements Filter {
    private format: string
    private value: string

    // TODO: Research if Sequelize does have a better way to this built-in
    DATE_FORMAT = {
        sqlite: (format: string) => sequelize.fn("strftime", format, sequelize.col("Expense.date")),
        mysql: (format: string) => sequelize.fn("date_format", sequelize.col("Expense.date"), format),
        oracle: (format: string) => {
            let newFormat = format.replace("%", "");
            newFormat = newFormat.padStart((format === "%m" ? 2 : 4), newFormat).toUpperCase()
            return sequelize.fn("to_char", sequelize.col("Expense.date"), newFormat)
        },
    }

    constructor(value: string, format: string) {
        this.format = format
        this.value = value
    }

    filter(): WhereOptions {
        if (this.value) {
            const func = this.DATE_FORMAT[connection.getDialect()]
            return sequelize.where(func(this.format), this.value.padStart(2, "0"))
        }

        return undefined
    }
}
