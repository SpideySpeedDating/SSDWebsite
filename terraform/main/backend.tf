terraform {
  backend "s3" {
    bucket         = "spideyspeeddating-bbd-tfstate"
    key            = "state/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "spideyspeeddating-bbd-tfstate"
  }
}