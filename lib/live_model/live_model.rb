require 'securerandom'

class LiveModel::LiveModel
  def self.stream_updates(event_name, class_symbol, id, response)
    stream_id = SecureRandom.uuid

    disposable = LiveModel::Disposable.new
    disposable << lambda { puts "Ending live stream #{stream_id}" }
    disposable << lambda { response.stream.close }

    begin
      response.headers["Content-Type"] = "text/event-stream"

      initial = eval(class_symbol.to_s.camelize).send('find', id.to_i)

      response.stream.write("event: #{event_name}\n")
      response.stream.write("data: #{initial.to_json}\n")
      response.stream.write("\n")

      heartbeat = Thread.new do
        loop do
          response.stream.write("event: heartbeat\n")
          response.stream.write("\n")
          sleep 5
        end
      end

      sender = Thread.new do
        listener = eval(class_symbol.to_s.camelize).send('on_update', id.to_i) do |model|
          response.stream.write("event: #{event_name}\n")
          response.stream.write("data: #{model.to_json}\n")
          response.stream.write("\n")
        end

        disposable << listener
      end

      disposable << heartbeat << sender.join

      disposable.join
    rescue IOError
      # When the client disconnects, we'll get an IOError on write
    ensure
      disposable.dispose
    end
  end
end