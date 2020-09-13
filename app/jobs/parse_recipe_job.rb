require 'uri'
require 'nokogiri'

class ParseRecipeJob < ApplicationJob
  queue_as :default

  def perform(recipe, html)
    domain = ParseRecipeJob.get_host_without_www(recipe.url)

    doc = Nokogiri::HTML.parse(html)

    handler = ParseRecipeJob.get_site_handler(domain, doc)
    handler.populate_recipe(recipe)
    recipe.save
  end

  private
    def self.get_site_handler(domain, doc)
      case domain
      when 'budgetbytes.com'
        BudgetBytes.new(doc)
      end
    end

    def self.get_host_without_www(url)
      uri = URI.parse(url)
      uri = URI.parse("http://#{url}") if uri.scheme.nil?
      host = uri.host.downcase
      host.start_with?('www.') ? host[4..-1] : host
    end
end
