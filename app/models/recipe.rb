class Recipe < ApplicationRecord
  def self.source_kinds(kinds)
    kinds.each do |kind|       
      define_method "source_is_#{kind}?" do
        source_kind == kind
      end
    end
  end

  publishes_updates

  serialize :ingredients, JSON
  serialize :directions, JSON

  source_kinds ['url', 'manual']
end
