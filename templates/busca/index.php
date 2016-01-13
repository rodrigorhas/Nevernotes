<?php

	require_once "../../core/init.php";

    $user = new User();

    if($user->isLoggedIn()) {

		function returnQueryFrom ($selectFields, $tables, $columns) {

			$q = $_POST['q'];
			$search = DB::getInstance();

			$result = new stdClass();
			$count = 0;

			$numOfTables = sizeof($tables);

			foreach ($tables as $tindex => $table) {
				$query = "SELECT ";
				$numOfFields = sizeof($selectFields[$tindex])-1;

				foreach ($selectFields[$tindex] as $sfindex => $sfield) {
					if($sfindex != $numOfFields)
						$query .= $sfield . ", ";
					else
						$query .= $sfield;
				}

				$query .= " FROM $table WHERE ";
				$queryArray = [];

				$numOfColumns = sizeof($columns[$tindex])-1;

				foreach ($columns[$tindex] as $cindex => $cfield) {
					if($cindex != $numOfColumns)
						$query .= $cfield . " LIKE ? OR ";
					else
						$query .= $cfield . " LIKE ?";

					$queryArray[] = "%$q%";
				}

				$search->query($query, $queryArray);

				if($search->count()) {
					$count++;
					$result->$table = $search->results();
				}
			}

			if(!$count) $result = ["noResultsFound" => true];

			return $result;

		}

		if(Input::exists('post')) {

			$masterQuery = returnQueryFrom(
				[
					["id", "username", "name"], // users
					["id", "placa", "cliente_id", "tipo"], // caminhoes
					["id", "razao_social", "nome_fantasia", "cnpj", "email", "endereco"], //clientes
					["id", "razao_social", "nome_fantasia", "cnpj", "email", "endereco"], // fornecedores,
					["id", "nome", "valor"],
					["id", "tipo"]
				],

				[
					"users",
					"caminhoes",
					"clientes",
					"fornecedores",
					"servicos",
					"tipos_caminhoes"
				],

				[
					["name", "username", "email"],
					["placa", "cliente_id", "tipo"],
					["razao_social", "nome_fantasia", "cnpj", "email", "endereco"],
					["razao_social", "nome_fantasia", "cnpj", "email", "endereco"],
					["nome", "valor"],
					["tipo"]
				]
			);

			echo json_encode($masterQuery);
		}
	}