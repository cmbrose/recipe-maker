class Recipe < ApplicationRecord
  include Filterable

  serialize :tags, Array

  scope :filter_by_name, lambda { |name|
    words = name.split(' ')
    name_query_clauses = words.map do |word|
      "(LOWER(CONCAT(' ', name, ' ')) LIKE '% #{word.downcase} %')"
    end
    name_query = '(' + name_query_clauses.join(' or ') + ')'

    where name_query
  }

  scope :filter_by_url, lambda { |url|
    where(source_kind: 'url')
      .where(source: url)
  }

  scope :filter_by_tag, lambda { |_tags|
    # The DB stores arrays as yaml, so search for a row like "- tag"
    clauses = _tags.split(',').map do |_tag|
      "(LOWER(tags) LIKE '%- #{_tag.downcase}\n%')"
    end

    where '(' + clauses.join(' and ') + ')'
  }

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

  source_kinds %w[url manual]
end
