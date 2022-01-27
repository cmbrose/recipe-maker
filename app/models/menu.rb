class Menu < ApplicationRecord
    serialize :recipes, Array

    def self.where_has_recipe(recipe_id)
        where "(recipes LIKE '%- #{recipe_id}\n%')"
    end
end
