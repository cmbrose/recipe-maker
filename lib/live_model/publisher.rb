require 'securerandom'

class LiveModel::Publisher
  def initialize()
    @listeners = {}
  end

  def subscribe(&block)
    id = SecureRandom.uuid
    @listeners[id] = Listener.new(block, -> { @listeners.delete(id) })
  end

  def publish(message)
    @listeners
      .map { |_, listener| listener }
      .filter { |listener| !listener.disposed? }
      .each { |listener| listener.receive(message) }
  end

  def dispose
    @listeners
      .map { |_, listener| listener }
      .filter { |listener| !listener.disposed? }
      .each { |listener| listener.dispose }
  end

  class Listener < LiveModel::Disposable
    def initialize(on_message, on_dispose)
      super()
      @on_message = on_message
      self << on_dispose
    end
  
    def receive(message)
      if disposed?
        raise "Disposed listener cannot receive"
      end

      @on_message.call(message)
    end
  end
end