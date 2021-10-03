class Recipe < ApplicationRecord
  serialize :tags, Array

  def self.source_kinds(kinds)
    kinds.each do |kind|       
      define_method "source_is_#{kind}?" do
        source_kind == kind
      end
    end
  end

  def self.search_by_name(search_text)
    words = search_text.split(' ')
    name_query_clauses = words.map do |word|
      "(LOWER(CONCAT(' ', name, ' ')) LIKE '% #{word.downcase} %')"
    end
    name_query = "(" + name_query_clauses.join(" or ") + ")"

    Recipe.where(name_query)
  end

  publishes_updates

  serialize :ingredients, JSON
  serialize :directions, JSON

  source_kinds ['url', 'manual']
end
