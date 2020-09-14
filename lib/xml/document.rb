require 'nokogiri'

class Xml::Document
  def initialize(text)
    @doc = Nokogiri::HTML.parse(text)
    @root = Node.wrap(@doc.root)
  end

  def method_missing(method_name, *args, &block)
    @root.send(method_name.to_s, *args)
  end

  class Node
    def initialize(root)
      @root = root
    end

    def xpath(path, *args)
      path = path.gsub(/@([a-z]+)=['"]([^'"]+)['"]/, 'contains(@\1, "\2")')
      
      if path.first == '/'
        path = ".#{path}"
      end

      Node.wrap(@root.xpath(path, *args))
    end

    def first_xpath(paths, *args)
      res = nil

      paths.each do |path|
        test = xpath(path, *args)
        if !test.nil? && test.length > 0
          res = test
          break
        end
      end

      Node.wrap(res)
    end

    def method_missing(method_name, *args, &block)
      if block.nil?     
        Node.wrap(@root.send(method_name.to_s, *args))
      else
        Node.wrap(@root.send(method_name.to_s, *args) { |arg| block.call(Node.wrap(arg)) })
      end
    end

    def self.wrap(obj)
      if obj.nil?
        return nil
      end

      case obj.class.to_s
      when "Nokogiri::XML::NodeSet"
        Node.new(obj)
      when "Nokogiri::XML::Element"
        Node.new(obj)
      else
        obj
      end
    end
  end
end