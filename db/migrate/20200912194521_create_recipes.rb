class CreateRecipes < ActiveRecord::Migration[6.0]
  def change
    create_table :recipes do |t|
      t.string :url
      t.string :text

      t.timestamps
    end
  end
end
