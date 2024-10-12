require 'test_helper'

class RecipesControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get new_recipe_url
    assert_response :success
  end

  test "should create recipe" do
    assert_difference('Recipe.count') do
      post recipes_url, params: { recipe: { name: 'New Recipe', source_kind: 'manual' } }
    end

    assert_redirected_to recipe_url(Recipe.last)
  end
end
