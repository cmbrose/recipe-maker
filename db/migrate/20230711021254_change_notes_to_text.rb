class ChangeNotesToText < ActiveRecord::Migration[6.0]
  def up
    change_column :recipes, :notes, :text
  end
  def down
    # This might cause trouble if you have strings longer
    # than 255 characters.
    change_column :recipes, :notes, :string
  end
end
